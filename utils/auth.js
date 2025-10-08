import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'change_this_to_a_strong_secret_replace_in_prod';

export const signToken = (payload, opts = {}) => {
  return jwt.sign(payload, SECRET, { expiresIn: opts.expiresIn || '7d' });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (e) {
    return null;
  }
};
