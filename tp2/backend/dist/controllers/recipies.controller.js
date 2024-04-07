var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as recipiesService from '../services/recipies.service.js';
function getRecipie(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const recipie = req.params.recipie;
        const profileId = req.params.profileId || req.body.profileId;
        console.log('Recipie');
        recipiesService.getRecipie(recipie, profileId)
            .then((response) => __awaiter(this, void 0, void 0, function* () {
            if (response) {
                res.status(200).json(response);
            }
            else {
                res.status(400).json({ error: { message: 'No se encontró la receta' } });
            }
        }))
            .catch((err) => {
            res.status(400).json({ error: { message: err.message } });
        });
    });
}
function likeRecipie(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const recipie = req.params.name;
        const profileId = req.body.profileId;
        recipiesService.likeRecipie(recipie, profileId)
            .then(() => {
            res.status(201).json({ message: "Receta agregada a favoritos" });
        })
            .catch((err) => {
            res.status(400).json({ error: { message: err.message } });
        });
    });
}
function unlikeRecipie(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const recipie = req.params.name;
        const profileId = req.body.profileId;
        recipiesService.unlikeRecipie(recipie, profileId)
            .then(() => {
            res.status(200).json({ message: "Receta removida de favoritos" });
        })
            .catch((err) => {
            res.status(400).json({ error: { message: err.message } });
        });
    });
}
function getLikedRecipies(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const profileId = req.body.profileId;
        recipiesService.getLikedRecipies(profileId)
            .then((recipies) => {
            res.status(200).json(recipies);
        })
            .catch((err) => {
            res.status(400).json({ error: { message: err.message } });
        });
    });
}
function newRecipie(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const preferences = req.body.preferences;
        const restrictions = req.body.restrictions;
        const day = req.body.day;
        const meal = req.body.meal;
        if (!preferences || !restrictions || !day || !meal) {
            res.status(400).json({ error: { message: 'Faltan datos' } });
            return;
        }
        recipiesService.newRecipie(preferences, restrictions, day, meal)
            .then((recipie) => {
            res.status(200).json(recipie);
        })
            .catch((err) => {
            res.status(400).json({ error: { message: err.message } });
        });
    });
}
export { getRecipie, likeRecipie, unlikeRecipie, getLikedRecipies, newRecipie, };
