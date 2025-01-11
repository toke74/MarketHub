import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Or
//import path from 'path';
//const __dirname = path.resolve();


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendEmail = async (options) => {
  const { email, subject, message, name, ejsUrl } = options;

  // const actCode = data.activationCode;
  // const name = data.name;

  //ejs file directory
  ejs.renderFile(
    path.join(__dirname, `../mails/${ejsUrl}`),
    { email, message, name },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const mailOptions = {
          from: process.env.SMTP_MAIL,
          to: email,
          subject,
          html: data,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log(`Email sent successful to ${email} `);
        });
      }
    }
  );
};
export default sendEmail;