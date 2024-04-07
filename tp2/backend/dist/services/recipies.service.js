var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ObjectId } from 'mongodb';
import { db, client } from './mongo.service.js';
import * as openAIService from './openApi.service.js';
const planCollection = db.collection('plans');
const likedCollection = db.collection('likes');
const profileCollection = db.collection('profiles');
function getRecipie(recipie, profileId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const plan = yield planCollection.findOne({ $or: [{ profileId: new ObjectId(profileId) }, { _id: new ObjectId(profileId) }] });
        if (!plan) {
            throw new Error('No se encontro el plan');
        }
        let returnRecipie = {};
        // @ts-ignore
        Object.keys(plan === null || plan === void 0 ? void 0 : plan.meals).forEach((day) => {
            // @ts-ignore
            Object.keys(plan.meals[day]).forEach((meal) => {
                // @ts-ignore
                if (plan.meals[day][meal].name == recipie) {
                    // @ts-ignore
                    returnRecipie = plan.meals[day][meal];
                }
            });
        });
        if (!returnRecipie.name) {
            throw new Error(`No se encontro la receta "${recipie}"`);
        }
        return returnRecipie;
    });
}
function likeRecipie(recipieName, profileId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const recipie = yield getRecipie(recipieName, profileId);
        if (recipie) {
            yield likedCollection.findOneAndUpdate({ name: recipieName }, {
                $setOnInsert: Object.assign(Object.assign({}, recipie), { profileId: new ObjectId(profileId) })
            }, {
                upsert: true,
            });
        }
        else {
            throw new Error(`No se encontro la receta "${recipieName}"`);
        }
    });
}
function unlikeRecipie(recipieName, profileId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const recipie = yield likedCollection.findOneAndDelete({ name: recipieName, profileId: new ObjectId(profileId) });
        if (!recipie.value) {
            throw new Error(`No se encontro la receta "${recipieName}"`);
        }
    });
}
function getLikedRecipies(profileId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const likedRecipies = yield likedCollection.find({ profileId: new ObjectId(profileId) }).toArray();
        return likedRecipies;
    });
}
function newRecipie(preferences, requirements, day, meal) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const rawOutput = yield openAIService.generateRecipie(preferences, requirements, '', day, meal);
        const recipie = JSON.parse(rawOutput);
        return recipie;
    });
}
export { getRecipie, likeRecipie, unlikeRecipie, getLikedRecipies, newRecipie, };
