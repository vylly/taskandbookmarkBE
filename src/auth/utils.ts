import { signinErrors } from './constants';

export const signinError = (message: string) => {
  const trunc = message.split('"')[1];
  return signinErrors[trunc];
};
