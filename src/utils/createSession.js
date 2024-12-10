import { randomBytes } from 'crypto';
import { FIFTEEN_MIN, THIRTY_DAYS } from '../constants/index.js';

export const createSession = () => ({
  accessToken: randomBytes(40).toString('base64'),
  refreshToken: randomBytes(40).toString('base64'),
  accessTokenValidUntil: Date.now() + FIFTEEN_MIN,
  refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS)
});
