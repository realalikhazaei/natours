const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

const Email = class {
  constructor(user, url) {
    this.from = process.env.MAILTRAP_FROM;
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
  }

  transporter() {
    if (process.env.NODE_ENV === 'development') {
      return nodemailer.createTransport({
        debug: true,
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASS,
        },
      });
    } else {
      return nodemailer.createTransport();
    }
  }

  async sendText(subject) {
    const options = {
      from: this.from,
      to: this.to,
      subject,
      text: this.url,
    };

    await this.transporter().sendMail(options);
  }

  async send(subject, template) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
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
};

module.exports = Email;
