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
const appURI = "http://127.0.0.1:5173";
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "hector.kerluke@ethereal.email", // generated ethereal user
        pass: "4J1PYwW8xygAWfUgnK" // generated ethereal password
    }
});
export const newPatientEmail = (doc, patient, rawPass) => __awaiter(void 0, void 0, void 0, function* () {
    yield transporter.sendMail({
        from: '"SAZ" <accounts@saz.ai>',
        to: patient.userName,
        subject: "Bienvenid@ a saz!",
        text: "Bienvenid@ a saz!, tu cuenta fue creada exitosamente.",
        html: `
      ${doc === null || doc === void 0 ? void 0 : doc.name} te ha invitado a saz!.

      Ingresá <a href="${appURI}">aqui</a> para empezar a usar la plataforma.

      Usando tu email y la contraseña ${rawPass}.

      Recordá cambiar tu contraseña una vez que ingreses al sistema.
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
      Bienvenid@ a saz!.

      Ingresá <a href="${appURI}">aqui</a> para comenzar a usar la plataforma.
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
      Hola, ${profile === null || profile === void 0 ? void 0 : profile.name} hay una nueva cuenta en espera de aprobación.

      Ingresá <a href="${appURI}">aqui</a> para revisarla.
    `,
    });
});
export default transporter;
