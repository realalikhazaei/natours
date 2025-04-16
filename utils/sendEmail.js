const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

const Email = class {
  #url;
  constructor(user, url) {
    this.from = `<${process.env.EMAIL_FROM}>`;
    this.to = user.email;
    this.#url = url;
    this.firstName = user.name.split(' ')[0];
  }

  transporter() {
    if (process.env.NODE_ENV === 'production') {
      return;
    } else {
      return nodemailer.createTransport({
        debug: true,
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    }
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      subject,
      url: this.#url,
      firstName: this.firstName,
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

  async sendText(subject, text) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text,
    };

    await this.transporter().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to Natours family!');
  }
};

module.exports = Email;
