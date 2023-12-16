import dotenv from 'dotenv';
import nodemailer from 'nodemailer'

dotenv.config();

const option = {
    service: process.env.MAIL_SERVICE,
    auth: {
        user: process.env.MAIL_ID,
        pass: process.env.MAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false,
    }
}

const mailer = nodemailer.createTransport(option);

export default mailer;