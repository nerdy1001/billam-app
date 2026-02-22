import 'dotenv/config'

import { Resend } from 'resend';

const resend = new Resend(`${process.env.RESEND_API_KEY}`);

interface ResendOptions {
  to: string;
  subject: string;
  html: string;
  text?: string
}

 
export async function sendEMailAction(options: ResendOptions) {
  try {
    await resend.emails.send({
      from: process.env.MAIL_FROM!,
      ...options
    })

    console.log("Email sent successfully")
  } catch (error: any) {
    console.error("[MAIL_ERROR]", error);
    console.error("[MAIL_ERROR FULL]", {
      message: error?.message,
      name: error?.name,
      statusCode: error?.statusCode,
      response: error?.response,
    });
    throw error;
  }
}