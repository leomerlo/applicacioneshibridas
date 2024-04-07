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
import * as planSchema from '../schemas/plan.schema.js';
import * as recipieSchema from '../schemas/recipies.schema.js';
import * as openApi from './openApi.service.js';
import * as profileService from './profile.service.js';
import * as recipiesService from './recipies.service.js';
import { db, client } from './mongo.service.js';
function generatePlan(profileId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const profile = yield profileService.getProfile(profileId);
        if (!profile) {
            throw new Error('El perfil no existe');
        }
        let likedRecipies = '';
        yield recipiesService.getLikedRecipies(profileId).then((recipies) => {
            likedRecipies = recipies.map((recipie) => recipie.name).join(', ');
        });
        const rawOutput = yield openApi.generatePlan(profile.restrictions || '', profile.preferences || '', likedRecipies);
        const meals = JSON.parse(rawOutput);
        return meals;
    });
}
function savePlan(profileId, meals) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        planSchema.meals.validate(meals, { abortEarly: false, stripUnknown: true })
            .then((meals) => __awaiter(this, void 0, void 0, function* () {
            const plan = {
                meals,
                profileId: new ObjectId(profileId)
            };
            const planExists = yield db.collection("plans").findOne({ profileId: new ObjectId(profileId) });
            if (planExists) {
                yield db.collection("plans").findOneAndReplace({ profileId: new ObjectId(profileId) }, plan);
            }
            else {
                yield db.collection("plans").insertOne(plan);
            }
        }))
            .catch((err) => {
            console.log('Validation error', err);
        });
    });
}
function generateDocPlan(docId, preferences, restrictions, title, listado, thread) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const rawOutput = yield openApi.generateRecipies(restrictions, preferences, listado);
        const meals = JSON.parse(rawOutput);
        planSchema.meals.validate(meals, { abortEarly: false, stripUnknown: true })
            .then((meals) => __awaiter(this, void 0, void 0, function* () {
            const plan = {
                meals,
                title: title,
                docId: new ObjectId(docId),
                threadId: thread
            };
            yield db.collection("plans").insertOne(plan);
        }))
            .catch((err) => {
            console.log('Validation error', err);
        });
    });
}
function getPlans(docId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const plans = yield db.collection("plans").find({ docId: new ObjectId(docId) }, { projection: { profileId: 0 } }).toArray();
        return plans;
    });
}
function getPlan(profileId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const plan = yield db.collection("plans").findOne({ profileId: new ObjectId(profileId) }, { projection: { profileId: 0 } });
        return plan;
    });
}
function getPlanById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const plan = yield db.collection("plans").findOne({ _id: new ObjectId(id) }, { projection: { _id: 0, profileId: 0 } });
        return plan;
    });
}
function getList(profileId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const list = yield db.collection("plans").findOne({ profileId: new ObjectId(profileId) }, { projection: { _id: 0, profileId: 0, meals: 0 } });
        return list === null || list === void 0 ? void 0 : list.shoppingList;
    });
}
function generateShoppingList(profileId, ingredients) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const unifiedList = [];
        ingredients.forEach((ingredient) => {
            let found = unifiedList.find((item) => {
                return item.name === ingredient.name;
            });
            if (found) {
                // @ts-ignore-next-line
                found += ingredient.quantity;
            }
            else {
                // @ts-ignore-next-line
                unifiedList.push({
                    name: ingredient.name,
                    quantity: ingredient.quantity,
                    unit: ingredient.unit
                });
            }
        });
        const organizedList = yield openApi.generateShoppingList(unifiedList);
        yield db.collection("plans").updateOne({ profileId: new ObjectId(profileId) }, { $set: { shoppingList: JSON.parse(organizedList) } });
    });
}
function assignPlan(patientId, planId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const plan = yield db.collection("plans").findOne({ _id: new ObjectId(planId) }, { projection: { _id: 0, docId: 0 } });
        if (!plan) {
            throw new Error('El plan no existe');
        }
        const assignedPlan = Object.assign(Object.assign({}, plan), { planId: new ObjectId(planId), profileId: new ObjectId(patientId) });
        const profilePlan = yield db.collection("plans").findOne({ profileId: new ObjectId(patientId) }, { projection: { _id: 0, docId: 0 } });
        if (profilePlan) {
            yield db.collection("plans").findOneAndReplace({ profileId: new ObjectId(patientId) }, assignedPlan);
        }
        else {
            yield db.collection("plans").insertOne(assignedPlan);
        }
    });
}
function deletePlan(docId, planId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const assigned = yield db.collection("plans").find({ planId: new ObjectId(planId) }).toArray();
        if (assigned.length > 0) {
            throw new Error('El plan esta asignado a al menos un paciente.');
        }
        else {
            yield db.collection("plans").deleteOne({ docId: new ObjectId(docId), _id: new ObjectId(planId) });
        }
    });
}
function editPlan(docId, planId, plan) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const exists = db.collection("plans").findOne({ docId: new ObjectId(docId), _id: new ObjectId(planId) });
        if (!exists) {
            throw new Error('El plan no existe');
        }
        yield db.collection("plans").findOneAndReplace({ docId: new ObjectId(docId), _id: new ObjectId(planId) }, plan);
    });
}
function replaceRecipie(profileId, day, meal, recipie) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const plan = yield db.collection("plans").findOne({ $or: [{ profileId: new ObjectId(profileId) }, { _id: new ObjectId(profileId) }] });
        const profile = yield db.collection("profiles").findOne({ _id: new ObjectId(profileId) });
        if (!plan || !profile) {
            return Promise.reject();
        }
        // Un listado de los nombres de todas las recetas del Plan
        const recipies = [];
        Array.from(Object.keys(plan.meals)).forEach((day) => {
            // @ts-ignore
            Array.from(Object.keys(plan === null || plan === void 0 ? void 0 : plan.meals[day])).forEach((meal) => {
                // @ts-ignore
                recipies.push(plan === null || plan === void 0 ? void 0 : plan.meals[day][meal].name);
            });
        });
        yield recipieSchema.recipie.validate(recipie, { abortEarly: false, stripUnknown: true });
        if (plan != undefined) {
            // @ts-ignore
            plan.meals[day][meal] = recipie;
        }
        else {
            Promise.reject();
        }
        /* const ingredients: Ingredients[] = [];
      
        Array.from(Object.keys(plan.meals)).forEach((day) => {
          // @ts-ignore
          Array.from(Object.keys(plan.meals[day])).forEach((meal: string) => {
            // @ts-ignore
            plan.meals[day][meal].ingredients.forEach((ingredient: Ingredients) => {
              ingredients.push(ingredient);
            });
          });
        });
      
        await generateShoppingList(profileId, ingredients); */
        console.log(plan.meals.sunday.breakfast);
        yield db.collection("plans").findOneAndReplace({ _id: new ObjectId(plan === null || plan === void 0 ? void 0 : plan._id) }, plan);
        return Promise.resolve(recipie);
    });
}
function generateRecipies(restrictions, preferences, listado) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const rawOutput = yield openApi.generateRecipies(restrictions, preferences, listado);
        const meals = JSON.parse(rawOutput);
        return meals;
    });
}
export { generatePlan, savePlan, generateDocPlan, getPlan, getPlanById, getList, generateShoppingList, getPlans, assignPlan, deletePlan, editPlan, replaceRecipie, generateRecipies };
