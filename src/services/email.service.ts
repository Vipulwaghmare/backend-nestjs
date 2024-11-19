import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';


@Injectable()
export class EmailService {
  private transporter: Transporter;
  constructor(
    private readonly configService: ConfigService,
  ) {
    this.transporter = createTransport({
      port: parseInt(this.configService.get('SMTP_PORT'), 10),
      host: this.configService.get('SMTP_SERVER'),
      secure: false,
      auth: {
        user: this.configService.get('SMTP_API_KEY_ID'),
        pass: this.configService.get('SMTP_API_SECRET'),
      },
    })
  };

  // ! Send mail
  // const data = {
  //   to: 'test@gmail.com',
  //   subject: 'Test',
  //   text: 'Text whre will this be',
  //   html: '<h1>Hello this is h1 tag</h1>'
  // }
  // sendEmail(data)

  private sendEmailPromise(mailData: Mail.Options) {
    return new Promise((res, rej) => {
      this.transporter.sendMail(mailData, (error, info) => {
        if (info) {
          return res({
            success: `Message Sent Successsfully. ID: ${info.messageId}`,
          });
        }
        console.error(error);
        rej(error);
      });
    })
  }

  async sendEmail(
    options: Mail.Options,
    throwError = true,
  ) {
    try {
      await this.sendEmailPromise({
        from: this.configService.get('SMTP_SENDER'),
        ...options
      });
    } catch (e) {
      if (throwError) throw new Error("Failed to send the email");
    }
  }
}
