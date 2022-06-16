import { env } from '@config/env';
import formData from 'form-data';
import Mailgun from 'mailgun.js';

export const send = async ({
  from,
  to,
  subject,
  template,
  variables,
  body,
  callback,
}: {
  from?: string;
  to: string;
  subject: string;
  template?: string;
  body?: string;
  variables?: any;
  callback?: () => void;
}) => {
  try {
    if (!from) {
      from = env.MAILGUN_FROM_NAME + ' <' + env.MAILGUN_FROM_EMAIL + '>';
    }

    if (!template && !body) {
      template = 'default';
    }

    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: 'api',
      key: env.MAILGUN_API_KEY,
      url: env.MAILGUN_HOST || null,
    });
    let data: any = {
      from,
      to,
      subject: subject,
    };

    if (variables) {
      data = { ...data, 'h:X-Mailgun-Variables': JSON.stringify(variables) };
    }

    if (body) {
      const html = body.replace(/(\r\n|\n|\r)/gm, '<br>');
      data = { ...data, html, text: body };
    }

    if (template) {
      data = { ...data, template };
    }

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
