import { signupErrors } from './constants';

export const signupError = (message: string) => {
  const trunc = message.split('"')[1];
  return signupErrors[trunc];
};
