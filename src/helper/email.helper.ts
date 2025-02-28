
import * as nodemailer from 'nodemailer';
type MailOptions = {
    email: string;
    subject: string;
    html: any
}

export const sendMail = async (data: MailOptions) => {
    const transport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'harsh@thesileo.com',
        pass: 'mmuu tllo scpg veoq',
      },
    });
    try {
        const mailOptions = {
          from: 'harsh@thesileo.com',
          to: data.email,
          subject: data.subject,
          html: data.html,
        };
        await transport.sendMail(mailOptions);
        return true;
    } catch (error) {
        return false;
    }
}