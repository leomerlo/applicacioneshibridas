var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as accountSchema from '../schemas/account.schema.js';
function validateAccount(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        return accountSchema.account.validate(req.body, { abortEarly: false, stripUnknown: true })
            .then((account) => {
            // @ts-ignore-next-line
            // Todo: body does not exist in Response type
            res.body = account;
            next();
        })
            .catch((err) => {
            res.status(400).json({ error: { message: err.message } });
        });
    });
}
export { validateAccount };
