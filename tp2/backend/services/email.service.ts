import nodemailer from 'nodemailer';
import { DocProfile, Profile } from '../types/profile';

const appURI = process.env.APP_URI || 'http://localhost:5173';

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
      user: process.env.ETHEREAL_USER, // generated ethereal user
      pass: process.env.ETHEREAL_PASS  // generated ethereal password
  }
});

export const newPatientEmail = async (doc: DocProfile, patient: any, rawPass: string) => {
  await transporter.sendMail({
    from: '"SAZ" <accounts@saz.ai>',
    to: patient.userName,
    subject: "Bienvenid@ a saz!",
    html: `
      ${doc?.name} te ha invitado a saz!<br><br>
      Ingresá <a href="${appURI}">acá</a> para empezar a usar la plataforma.<br><br>
      Usando tu email y la contraseña ${rawPass}.<br><br>
      Recordá cambiar tu contraseña una vez que ingreses al sistema.<br><br>
    `,
  });
}

export const assignedPlanEmail = async (patient: any) => {
  await transporter.sendMail({
    from: '"SAZ" <accounts@saz.ai>',
    to: patient.email,
    subject: "Nuevo plan asignado",
    html: `
      Se te asignó un nuevo plan.<br><br>
      Ingresá <a href="${appURI}">acá</a> para verlo.<br><br>
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
      Bienvenid@ a saz!.<br><br>
      Ingresá <a href="${appURI}">acá</a> para comenzar a usar la plataforma.<br><br>
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
      Hola, ${profile?.name} hay una nueva cuenta en espera de aprobación.<br><br>
      Ingresá <a href="${appURI}">acá</a> para revisarla.<br><br>
    `,
  });
}

export default transporter;