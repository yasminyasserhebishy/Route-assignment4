import nodemailer from "nodemailer"


const sendEmail = async ({from = process.env.SENDEREMAIL, to , subject , text , html,cc,bcc,attachments }={})=>{
    const transporter = nodemailer.createTransport({
        service :'gmail',
        auth: {
          user: process.env.SENDEREMAIL,
          pass: process.env.SENDERPASS,
        },
        tls: {
            rejectUnauthorized: false
          }
      });
      
    
        const info = await transporter.sendMail({
          from: `"yasoo 👻" <${from}>`, 
          to,
          subject,
          text,
          html,
          cc,
          bcc,
          attachments
        });
      
        console.log("Message sent: %s", info.messageId);
      
      }

export default sendEmail

