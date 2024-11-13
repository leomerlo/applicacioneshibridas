var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import nodemailer from 'nodemailer';
const appURI = process.env.APP_URI || 'http://localhost:5173';
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.ETHEREAL_USER, // generated ethereal user
        pass: process.env.ETHEREAL_PASS // generated ethereal password
    }
});
export const newPatientEmail = (doc, patient, rawPass) => __awaiter(void 0, void 0, void 0, function* () {
    yield transporter.sendMail({
        from: '"SAZ" <accounts@saz.ai>',
        to: patient.userName,
        subject: "Bienvenid@ a saz!",
        html: `
      ${doc === null || doc === void 0 ? void 0 : doc.name} te ha invitado a saz!<br><br>
      Ingresá <a href="${appURI}">aqui</a> para empezar a usar la plataforma.<br><br>
      Usando tu email y la contraseña ${rawPass}.<br><br>
      Recordá cambiar tu contraseña una vez que ingreses al sistema.<br><br>
    `,
    });
});
export const newDocEmail = (profile) => __awaiter(void 0, void 0, void 0, function* () {
    yield transporter.sendMail({
        from: '"SAZ" <accounts@saz.ai>',
        to: profile.email,
        subject: "Bienvenid@ a saz!",
        text: "Bienvenid@ a saz!, tu cuenta fue creada exitosamente.",
        html: `
      Bienvenid@ a saz!.<br><br>
      Ingresá <a href="${appURI}">aqui</a> para comenzar a usar la plataforma.<br><br>
    `,
    });
});
export const pendingUserEmail = (profile) => __awaiter(void 0, void 0, void 0, function* () {
    yield transporter.sendMail({
        from: '"SAZ" <accounts@saz.ai>',
        to: profile.email,
        subject: "Bienvenid@ a saz!",
        text: "Bienvenid@ a saz!, tu cuenta fue creada exitosamente.",
        html: `
      Hola, ${profile === null || profile === void 0 ? void 0 : profile.name} hay una nueva cuenta en espera de aprobación.<br><br>
      Ingresá <a href="${appURI}">aqui</a> para revisarla.<br><br>
    `,
    });
});
export default transporter;
