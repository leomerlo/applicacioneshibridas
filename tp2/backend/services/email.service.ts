import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
      user: "hector.kerluke@ethereal.email", // generated ethereal user
      pass: "4J1PYwW8xygAWfUgnK"  // generated ethereal password
  }
});

export default transporter;