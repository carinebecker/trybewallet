export const CHANGE_EMAIL_LOGIN = 'CHANGE_EMAIL_LOGIN';
export const CHANGE_PASSWORD_LOGIN = 'CHANGE_PASSWORD_LOGIN';

export const handleEmail = (emailLogin) => ({
  type: CHANGE_EMAIL_LOGIN,
  emailLogin,
});
