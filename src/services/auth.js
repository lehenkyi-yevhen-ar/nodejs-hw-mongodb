import * as fs from 'node:fs';
import path from 'node:path';
import { Session } from '../db/models/session.js';
import { User } from '../db/models/user.js';
import bcrypt from 'bcrypt';
import { createSession } from '../utils/createSession.js';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { sendMail } from '../utils/sendMail.js';
import handlebars from 'handlebars';
import crypto from 'crypto';

const RESET_PASSWORD_TEMPLATE = fs.readFileSync(
  path.resolve('src/templates/reset-password.hbs'),
  { encoding: 'utf-8' }
);

export async function findUserByEmail(email) {
  return await User.findOne({ email });
}

export async function createUser(userData) {
  const encryptedPassword = await bcrypt.hash(userData.password, 10);
  return User.create({
    ...userData,
    password: encryptedPassword
  });
}

export async function createActiveSession(userId) {
  await Session.deleteOne({ userId });
  return Session.create({ userId, ...createSession() });
}

export async function logoutUser(sessionId) {
  await Session.deleteOne({ _id: sessionId });
}

export async function refreshSession(sessionId, refreshToken) {
  const session = await Session.findById(sessionId);

  if (session === null) {
    throw createHttpError(401, 'Session not found!');
  }

  if (session.refreshToken !== refreshToken) {
    throw createHttpError(401, 'Session not found!');
  }

  if (session.refreshTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Refresh token is timed out!');
  }

  await Session.deleteOne({ _id: sessionId });

  return Session.create({ userId: session.userId, ...createSession() });
}

export async function sendResetEmail(email) {
  const user = await User.findOne({ email });

  if (user === null) {
    throw createHttpError(404, 'User not found!');
  }

  const resetToken = jwt.sign(
    { sub: user._id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: '10m'
    }
  );

  const link = process.env.APP_DOMAIN;

  const html = handlebars.compile(RESET_PASSWORD_TEMPLATE);

  await sendMail({
    from: process.env.SMTP_FROM,
    to: user.email,
    subject: 'Reset password',
    html: html({ link, resetToken })
  });

  console.log(resetToken);
}

export async function resetPassword(newPassword, token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ _id: decoded.sub, email: decoded.email });

    if (user === null) {
      throw createHttpError(404, 'User Not Found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
    await Session.deleteOne(user._id);
  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      throw createHttpError(401, 'Token is expired or invalid!');
    }
    throw createHttpError(
      500,
      'Failed to send the email, please try again later'
    );
  }
}

export async function loginOrRegister(payload) {
  const user = await User.findOne({ email: payload.email });
  if (user === null) {
    const password = await bcrypt.hash(
      crypto.randomBytes(30).toString('base64'),
      10
    );

    const createdUser = await User.create({
      email: payload.email,
      name: payload.name,
      password
    });

    return Session.create({ userId: createdUser._id, ...createSession() });
  }

  await Session.deleteOne({ userId: user._id });

  return Session.create({ userId: user._id, ...createSession() });
}
