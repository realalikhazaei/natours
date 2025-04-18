const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

const Email = class {
  #url;
  constructor(user, url) {
    this.from = process.env.NODE_ENV === 'production' ? process.env.YAHOO_FROM : process.env.MAILTRAP_FROM;
    this.to = user.email;
    this.#url = url;
    this.firstName = user.name.split(' ')[0];
  }

  transporter() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        secure: true,
        // service: 'Yahoo',
        host: process.env.YAHOO_HOST,
        port: process.env.YAHOO_PORT,
        auth: {
          user: process.env.YAHOO_USER,
          pass: process.env.YAHOO_PASS,
        },
      });
    } else {
      return nodemailer.createTransport({
        debug: true,
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASS,
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
