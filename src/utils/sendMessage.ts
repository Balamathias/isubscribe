'use server'

import twilio from 'twilio';

export default async function sendMessage({message, phone}: {message: string, phone: string}) {
  const accountSid = <string>process.env.NEXT_TWILIO_ACCOUNT_SID;
  const token = <string>process.env.NEXT_TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, token);
  
  client.messages
    .create({
      body: message,
      from: <string>process.env.NEXT_TWILIO_PHONE_NUMBER,
      to: phone,
    })
    .then((message) =>{
        return {message, success: true}
    }
    )
    .catch((error) => {
      console.log(error);
        return {error, success: false}
    });
    return {message: 'Success', status: 201}
}
