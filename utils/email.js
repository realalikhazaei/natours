const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

const Email = class {
  #url;
  constructor(user, url = '') {
    this.from = process.env.SMTP_FROM;
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.#url = url;
  }

  transporter() {
    return nodemailer.createTransport({
      secure: true,
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendText(subject) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: this.#url,
    };

    await this.transporter().sendMail(mailOptions);
  }

  async send(subject, template) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.#url,
      subject,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    };

    await this.transporter().sendMail(mailOptions);
  }

  async sendResetPassword() {
    await this.send('Your password reset link (expires in 10 mins)', 'resetPassword');
  }

  async sendWelcome() {
    await this.send('Welcome to Natours family!', 'welcome');
  }
};

module.exports = Email;
