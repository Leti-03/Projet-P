import crypto from 'crypto';

export const generatePassword = () => {
  const chiffres = '0123456789';
  let password = 'AT-';
  for (let i = 0; i < 8; i++) {
    const randomIndex = crypto.randomInt(0, chiffres.length);
    password += chiffres[randomIndex];
  }
  return password;
};