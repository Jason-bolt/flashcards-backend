import jwt, { JwtPayload } from "jsonwebtoken";
import envs from "../../config/env";

export const generateJwt = (data: object): string => {
  const token: string = jwt.sign(data, envs.JWT_SECRET, {
    expiresIn: envs.TOKEN_EXPIRY
  });
  return token;
};

export const checkAuthorizationToken = (authorization: string): string => {
  let bearerToken: string | null = null;
  if (authorization) {
    const token = authorization.split(" ")[1];
    bearerToken = token || authorization;
  }
  return bearerToken;
};

export const checkToken = (authorization: string): string => {
  const bearerToken = checkAuthorizationToken(authorization);
  return bearerToken;
};

export const verifyToken = (token: string): string | JwtPayload => {
  return jwt.verify(token, envs.JWT_SECRET);
};

export const authenticateUser = (
    authorization: string,
): string | jwt.JwtPayload => {
  try {
    const token = checkToken(authorization);
    if (!token) {
      return null;
    } else {
      const decoded = verifyToken(token);
      return decoded;
    }
  } catch (error) {
    return null
  }
};
