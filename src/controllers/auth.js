import createHttpError from 'http-errors';
import {
  createActiveSession,
  createUser,
  findUserByEmail,
  logoutUser,
  refreshSession,
  resetPassword,
  sendResetEmail
} from '../services/auth.js';
import bcrypt from 'bcrypt';

export async function registerUserController(req, res) {
  const user = await findUserByEmail(req.body.email);
  if (user) {
    throw createHttpError(409, 'Email in use!');
  }
  const newUser = await createUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      name: newUser.name,
      email: newUser.email
    }
  });
}

export async function loginUserController(req, res) {
  const user = await findUserByEmail(req.body.email);
  if (!user) {
    throw createHttpError(401, 'Email or password is wrong!');
  }
  const isEqual = await bcrypt.compare(req.body.password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'Email or password is wrong!');
  }
  const session = await createActiveSession(user._id);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken
    }
  });
}

export async function logoutUserController(req, res) {
  const { sessionId } = req.cookies;
  if (typeof sessionId === 'string') {
    await logoutUser(sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).end();
}

export async function refreshUserController(req, res) {
  const { sessionId, refreshToken } = req.cookies;

  const session = await refreshSession(sessionId, refreshToken);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil
  });

  res.status(200).json({
    status: 200,
    message: 'Session refreshed!',
    data: {
      accessToken: session.accessToken
    }
  });
}

export async function sendResetEmailController(req, res) {
  const { email } = req.body;

  await sendResetEmail(email);

  res.send({
    status: 200,
    message: 'Reset password email has been successfully sent'
  });
}

export async function resetPasswordController(req, res) {
  const { password, token } = req.body;

  await resetPassword(password, token);

  res.send({
    status: 200,
    message: 'Password reset successfully!',
    data: null
  });
}
