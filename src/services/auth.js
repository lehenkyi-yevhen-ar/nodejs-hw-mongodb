import { Session } from '../db/models/session.js';
import { User } from '../db/models/user.js';
import bcrypt from 'bcrypt';
import { createSession } from '../utils/createSession.js';
import createHttpError from 'http-errors';

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
