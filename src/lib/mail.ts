import nodemailer, { type SentMessageInfo } from 'nodemailer';

const account = await nodemailer.createTestAccount();
export const mail = nodemailer.createTransport({
  host: account.smtp.host,
  port: account.smtp.port,
  secure: account.smtp.secure,
  debug: true,
  auth: {
    user: account.user,
    pass: account.pass,
  },
});

export const getInfo = (info: SentMessageInfo) => {
  return nodemailer.getTestMessageUrl(info);
};
