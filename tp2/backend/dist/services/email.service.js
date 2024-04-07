import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: "hector.kerluke@ethereal.email",
        pass: "4J1PYwW8xygAWfUgnK" // generated ethereal password
    }
});
export default transporter;
