import { env } from '@config/env';
import formData from 'form-data';
import Mailgun from 'mailgun.js';

const send = async ({
  to,
  subject,
  template,
  variables,
  callback,
}: {
  to: string;
  subject: string;
  template: string;
  variables: any;
  callback?: () => void;
}) => {
  try {
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: 'api',
      key: env.MAILGUN_API_KEY,
      url: env.MAILGUN_HOST || null,
    });
    const data = {
      from: env.MAILGUN_FROM_NAME + ' <' + env.MAILGUN_FROM_EMAIL + '>',
      to,
      subject: subject,
      template: template,
      'h:X-Mailgun-Variables': JSON.stringify(variables),
    };
    await mg.messages.create(env.MAILGUN_DOMAIN, data);

    if (callback) callback();
  } catch (error) {
    throw Error(error.message);
  }
};

// export const sendResetPasswordEmail = async (to: string, token: string) => {
//   const GAMELAB_FRONTEND_URL = process.env.GAMELAB_FRONTEND_URL || '';

//   await send({
//     to,
//     subject: 'Reset Password',
//     template: 'password-reset',
//     variables: {
//       resetLink: GAMELAB_FRONTEND_URL + '/password/reset?resetToken=' + token,
//     },
//   });
// };

// export const sendWelcomeEmail = async (to: string, name: string) => {
//   await send({
//     to,
//     subject: 'Welcome to GameLab',
//     template: 'welcome',
//     variables: {
//       name,
//     },
//   });
// };

export const sendOneTimePassword = async (to: string, tempPassword: string) => {
  await send({
    to,
    subject: 'Your one-time password',
    template: 'magic-auth',
    variables: {
      tempPassword,
    },
  });
};
