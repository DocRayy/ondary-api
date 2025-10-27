import { SESV2 } from 'aws-sdk';

export class MailHelper {
  protected ses: SESV2;

  constructor() {
    this.ses = new SESV2({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      region: process.env.AWS_DEFAULT_REGION,
      apiVersion: '2019-09-27',
    });
  }

  sendEmail(toEmail: string, subject: string, body: string) {
    return this.ses.sendEmail(
      {
        Destination: {
          ToAddresses: [toEmail],
        },
        Content: {
          Simple: {
            Body: {
              Html: {
                Data: body,
                Charset: 'utf-8',
              },
            },
            Subject: {
              Data: subject,
              Charset: 'utf-8',
            },
          },
        },
        FromEmailAddress: 'no-reply@liszthoven.id',
      },
      (error, data) => {
        console.log(error, data);
      },
    );
  }
}
