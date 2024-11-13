import nodemailer from 'nodemailer';
import { DocProfile, Profile } from '../types/profile';

const appURI = "http://127.0.0.1:5173";

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
      user: "hector.kerluke@ethereal.email", // generated ethereal user
      pass: "4J1PYwW8xygAWfUgnK"  // generated ethereal password
  }
});

export const newPatientEmail = async (doc: DocProfile, patient: any, rawPass: string) => {
  await transporter.sendMail({
    from: '"SAZ" <accounts@saz.ai>',
    to: patient.userName,
    subject: "Bienvenid@ a saz!",
    text: "Bienvenid@ a saz!, tu cuenta fue creada exitosamente.",
    html: `
      ${doc?.name} te ha invitado a saz!.

      Ingresá <a href="${appURI}">aqui</a> para empezar a usar la plataforma.

      Usando tu email y la contraseña ${rawPass}.

      Recordá cambiar tu contraseña una vez que ingreses al sistema.
    `,
  });
}

export const newDocEmail = async (profile: DocProfile) => {
  await transporter.sendMail({
    from: '"SAZ" <accounts@saz.ai>',
    to: profile.email,
    subject: "Bienvenid@ a saz!",
    text: "Bienvenid@ a saz!, tu cuenta fue creada exitosamente.",
    html: `
      Bienvenid@ a saz!.

      Ingresá <a href="${appURI}">aqui</a> para comenzar a usar la plataforma.
    `,
  });
}

export const pendingUserEmail = async (profile: Profile) => {
  await transporter.sendMail({
    from: '"SAZ" <accounts@saz.ai>',
    to: profile.email,
    subject: "Bienvenid@ a saz!",
    text: "Bienvenid@ a saz!, tu cuenta fue creada exitosamente.",
    html: `
      Hola, ${profile?.name} hay una nueva cuenta en espera de aprobación.

      Ingresá <a href="${appURI}">aqui</a> para revisarla.
    `,
  });
}

export default transporter;