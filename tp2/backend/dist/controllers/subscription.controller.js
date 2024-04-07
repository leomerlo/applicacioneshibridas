var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as subscribeService from '../services/subscription.service.js';
const subscribe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const profileId = req.body.profileId;
    delete req.body.profileId;
    const paymentData = req.body;
    try {
        yield subscribeService.subscribe(profileId, paymentData);
        return res.status(201).json({ message: 'Payment created' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error creating payment', error });
    }
});
const checkSubscriptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield subscribeService.checkSubscriptions();
        console.log('Outdated Subscriptions', response.length);
        yield Promise.all(response.map((profile) => __awaiter(void 0, void 0, void 0, function* () {
            yield subscribeService.deactivate(profile._id);
        })));
        return res.status(200).json({ message: 'Subscriptions checked' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error checking subscriptions', error });
    }
});
export { subscribe, checkSubscriptions };
