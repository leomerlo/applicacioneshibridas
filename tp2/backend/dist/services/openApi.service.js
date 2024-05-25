var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import { OpenAI } from "openai";
import dotenv from 'dotenv';
dotenv.config();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});
const model3 = "gpt-3.5-turbo-16k";
const model4 = "gpt-4-0125-preview";
const model4o = "gpt-4o";
const temperature = 0;
function promptHelper(systemPrompt, userPrompt) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const timeStart = new Date();
            console.log('Start OpenAI fetch', timeStart.getHours(), timeStart.getMinutes(), timeStart.getSeconds());
            const completion = yield openai.chat.completions.create({
                model: model3,
                messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
                temperature: 1
            });
            const timeEnd = new Date();
            const timeDiff = Math.abs((timeStart.getTime() - timeEnd.getTime()) / 1000);
            let result = (_a = completion.choices[0].message) === null || _a === void 0 ? void 0 : _a.content;
            console.log("Result: ", (_b = completion.choices[0].message) === null || _b === void 0 ? void 0 : _b.content);
            console.log("openAi usage: ", completion.usage);
            console.log('End OpenAI fetch', timeEnd.getHours(), timeEnd.getMinutes(), timeEnd.getSeconds());
            console.log('Query time: ', timeDiff + 'segs');
            return result;
        }
        catch (error) {
            if (error.response) {
                console.log(error.response.status);
                console.log(error.response.data);
            }
            else {
                console.log(error.message);
            }
            throw new Error(error);
        }
    });
}
function promptHelperJSON(systemPrompt, userPrompt) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const completion = yield openai.chat.completions.create({
                model: model4,
                messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
                temperature: 0,
                response_format: {
                    type: "json_object"
                }
            });
            let result = (_a = completion.choices[0].message) === null || _a === void 0 ? void 0 : _a.content;
            return result;
        }
        catch (error) {
            if (error.response) {
                console.log(error.response.status);
                console.log(error.response.data);
            }
            else {
                console.log(error.message);
            }
            throw new Error(error);
        }
    });
}
function promptHelperStream(systemPrompt, userPrompt, dataCB, dataEnd) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        try {
            const completion = yield openai.chat.completions.create({
                model: model4o,
                messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
                temperature: 0,
                stream: true,
                response_format: {
                    type: "json_object"
                }
            });
            let fullStream = "";
            console.log("Start streaming response");
            try {
                for (var _d = true, completion_1 = __asyncValues(completion), completion_1_1; completion_1_1 = yield completion_1.next(), _a = completion_1_1.done, !_a; _d = true) {
                    _c = completion_1_1.value;
                    _d = false;
                    const chunk = _c;
                    if (chunk.choices[0].delta.content != undefined) {
                        fullStream = chunk.choices[0].delta.content;
                        dataCB(fullStream);
                    }
                    else {
                        console.log("End streaming response");
                        dataEnd(fullStream);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = completion_1.return)) yield _b.call(completion_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        catch (error) {
            if (error.response) {
                console.log(error.response.status);
                console.log(error.response.data);
            }
            else {
                console.log(error.message);
            }
            throw new Error(error);
        }
    });
}
function assistantHelperStream(threadId, dataCB, dataEnd) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_2, _b, _c;
        const stream = yield openai.beta.threads.runs.create(threadId, { assistant_id: "asst_XbEObay3S8R1P6eU5QGWESuy", stream: true });
        console.log("Start streaming response");
        let fullChat = "";
        try {
            for (var _d = true, stream_1 = __asyncValues(stream), stream_1_1; stream_1_1 = yield stream_1.next(), _a = stream_1_1.done, !_a; _d = true) {
                _c = stream_1_1.value;
                _d = false;
                const event = _c;
                if (event.event === "thread.message.delta" && event.data.delta.content != undefined) {
                    fullChat += event.data.delta.content[0].text.value;
                    dataCB(event.data.delta.content[0].text.value);
                }
                else if (event.event === "thread.run.completed") {
                    dataEnd(fullChat);
                }
                else if (event.event === "thread.message.completed") {
                    console.log(event);
                }
                else {
                    console.log(event.event);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = stream_1.return)) yield _b.call(stream_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    });
}
function generatePlan(restrictions, preferences, recipies) {
    return __awaiter(this, void 0, void 0, function* () {
        const systemPrompt = `
  Cuando te pida ayuda, vas a actuar como un jefe de cocina, y armar un plan de comida semanal para un cliente, siguiendo las "restricciones" y "preferencias" que elijan.
  Las restricciones son más importantes que las preferencias. Las restricciones son lo mas importante de todo ya que una restriccion que no se siga puede resultar en problemas.
  Las preferencias son menos importantes que las restricciones, pero aun asi son importantes.
  El plan de comida debe incluir desayuno, almuerzo y cena para cada dia de la semana como se especifica en el ejemplo.
  Los nombres de los dias, breakfast, lunch y dinner deben estar en inglés, mientras que los nombres de las comidas, recetas e instrucciones deben estar en español.

  Segui las siguientes reglas al crear la receta:
  - Los ingredientes deben estar expresados en singular y nunca en plural.
  - Las cantidades de los ingredientes deben estar siempre expresadas en gr y ml. Nunca en tazas, cucharadas o cualquier otra unidad que no sea metrica.
  - Los ingredientes enteros deben estar expresados en unidades. Nunca en dientes, piezas o cualquier otra unidad.
  - Los ingredientes y valores nutricionales deben estar expresados para 1 comensales.
  - Los pasos deben estar expresados en hasta 10 pasos fáciles de seguir.
  - Los valores nutritivos deben estar expresados junto con su unidad de medida.
  - Las cantidades deben ser representadas en numeros enteros, nunca uses fracciones o decimales.
  - Usando los ejemplos podés entender que comida le gusta al usuario y proponerle las mismas recetas o cosas similares.

  Formatea la respuesta completa como un solo string JSON sin saltos de linea o palabras que no sean parte de la respuesta.

  Usa esto como ejemplo para el formato pero no para las comidas o valores nutricionales:
  {
    "monday": {
      "breakfast": {
        "name": yup.string().required(),
        "ingredients": yup.array().of(yup.object({
          "name": yup.string().lowercase().required(),
          "quantity": yup.mixed().required(),
          "unit": yup.string()
        })).required(),
        "instructions": yup.array().of(yup.string().required()).required(),
        "nutrition": yup.object({
          "calorias": yup.number(),
          "carbohidratos": yup.number(),
          "grasas": yup.number(),
          "proteinas": yup.number()
        }).required()
      }
    }
  }
  `;
        const userPrompt = `
    Quiero un plan de comidas que cumpla con las siguientes restricciones y preferencias:
    Restricciones: ${restrictions}

    Preferencias: ${preferences}

    Ejemplos: ${recipies}
  `;
        return yield promptHelper(systemPrompt, userPrompt);
    });
}
function generateShoppingList(ingredients) {
    return __awaiter(this, void 0, void 0, function* () {
        const systemPrompt = `
    Cuando te pida ayuda, vas a actuar como un jefe de cocina, y tomar los objetos de ingredientes que te pase y organizarlos todos en una lista optimizada por categorias utilizando: produce, meats y others.

    Meats solamente tiene que incluir productos de carne de origen animal. Huevos y proteinas vegetales van en others.

    Formatea la respuesta completa como un solo string JSON sin saltos de linea o palabras que no sean parte de la respuesta.

    Ejemplo:

    produce: [
      {
        name: "banana",
        quantity: 1,
        unit: "unidad"
      }
    ]
  `;
        const userPrompt = `
    Quiero una lista de compras organizada con los siguientes ingredientes:

    ${JSON.stringify(ingredients)}
  `;
        return yield promptHelper(systemPrompt, userPrompt);
    });
}
function generateRecipie(restrictions, preferences, recipies, day, meal, dataCB, dataEnd) {
    return __awaiter(this, void 0, void 0, function* () {
        const systemPrompt = `Cuando te pida ayuda, vas a actuar como un jefe de cocina, y armar una receta para un cliente, siguiendo las "restricciones" y "preferencias" que elijan.
  Las restricciones son más importantes que las preferencias. Las restricciones son lo mas importante de todo ya que una restriccion que no se siga puede resultar en problemas.
  Las preferencias son menos importantes que las restricciones, pero aun asi son importantes.
  ${meal === 'breakfast' ? "La receta es para un desayuno" : ""}

  Segui las siguientes reglas al crear la receta:
  - Los ingredientes deben estar expresados en singular y nunca en plural.
  - Las cantidades de los ingredientes deben estar siempre expresadas en gr y ml. Nunca en tazas, cucharadas o cualquier otra unidad que no sea metrica.
  - Los ingredientes enteros deben estar expresados en unidades. Nunca en dientes, piezas o cualquier otra unidad.
  - Los ingredientes y valores nutricionales deben estar expresados para 1 comensales.
  - Los pasos deben estar expresados en hasta 10 pasos fáciles de seguir.
  - Los valores nutritivos deben estar expresados junto con su unidad de medida.
  - Las cantidades deben ser representadas en numeros enteros, nunca uses fracciones o decimales.
  - Usando los ejemplos podés entender que comida le gusta al usuario y proponerle las mismas recetas o cosas similares.

  Formatea la respuesta completa como un solo string JSON sin saltos de linea o palabras que no sean parte de la respuesta.

  Usa esto como ejemplo para el formato pero no para las comidas o valores nutricionales:

  {
    "name": yup.string().lowercase().required(),
    "ingredients": yup.array().of(yup.object({
      "name": yup.string().lowercase().required(),
      "quantity": yup.number().required(),
      "unit": yup.string().oneOf(['gr', 'kg', 'ml', 'l', 'un'])
    })).required(),
    "instructions": yup.array().of(yup.string().required()).required(),
    "nutrition": yup.object({
      "calorias": yup.number().required(),
      "carbohidratos": yup.number().required(),
      "grasas": yup.number().required(),
      "proteinas": yup.number().required()
    }).required()
  }
  `;
        const userPrompt = `
    Quiero una receta con las siguientes restricciones y preferencias:
    Restricciones: ${restrictions}

    Preferencias: ${preferences}

    La receta no debe ser ninguna ni muy similar a estas: ${recipies}
  `;
        return yield promptHelperStream(systemPrompt, userPrompt, dataCB, dataEnd);
    });
}
function generateRecipies(restrictions, preferences, listado) {
    return __awaiter(this, void 0, void 0, function* () {
        const systemPrompt = `
  Cuando te pida ayuda, vas a actuar como un jefe de cocina, y armar las instrucciones e ingredientes para un plan semanal de comidas basada en el "listado" que te enviaran.
  No cambies ninguna de las comidas que ya estan en el listado.
  Las restricciones son más importantes que las preferencias. Las restricciones son lo mas importante de todo ya que una restriccion que no se siga puede resultar en problemas.
  Las preferencias son menos importantes que las restricciones, pero aun asi son importantes.

  Segui las siguientes reglas al crear la receta:
  - Los ingredientes deben estar expresados en singular y nunca en plural.
  - Las cantidades de los ingredientes deben estar siempre expresadas en gr y ml. Nunca en tazas, cucharadas o cualquier otra unidad que no sea metrica.
  - Los ingredientes enteros deben estar expresados en unidades. Nunca en dientes, piezas o cualquier otra unidad.
  - Los ingredientes y valores nutricionales deben estar expresados para 1 comensales.
  - Los pasos deben estar expresados en hasta 10 pasos fáciles de seguir.
  - Los valores nutritivos deben estar expresados junto con su unidad de medida.
  - Las cantidades deben ser representadas en numeros enteros, nunca uses fracciones o decimales.
  - Usando los ejemplos podés entender que comida le gusta al usuario y proponerle las mismas recetas o cosas similares.

  Formatea la respuesta completa como un solo string JSON sin saltos de linea o palabras que no sean parte de la respuesta.

  Usa esto como ejemplo para el formato pero no para las comidas o valores nutricionales:
  {
    "monday": {
      "breakfast": {
        "name": yup.string().required(),
        "ingredients": yup.array().of(yup.object({
          "name": yup.string().lowercase().required(),
          "quantity": yup.mixed().required(),
          "unit": yup.string()
        })).required(),
        "instructions": yup.array().of(yup.string().required()).required(),
        "nutrition": yup.object({
          "calorias": yup.number(),
          "carbohidratos": yup.number(),
          "grasas": yup.number(),
          "proteinas": yup.number()
        }).required()
      }
    }
  }
  `;
        const userPrompt = `
    Restricciones: Comida vegetariana
    Preferencias: Alto en proteinas
    Listado: ${JSON.stringify(listado)}
  `;
        return yield promptHelper(systemPrompt, userPrompt);
    });
}
function startThread(title, restrictions, preferences) {
    return __awaiter(this, void 0, void 0, function* () {
        const thread = yield openai.beta.threads.createAndRun({
            assistant_id: "asst_XbEObay3S8R1P6eU5QGWESuy",
            thread: {
                messages: [
                    {
                        role: "user",
                        content: `
          Armame un plan de comidas semanal con las siguientes restricciones y preferencias.
          Restricciones: ${restrictions}. Preferencias: ${preferences}.`
                    }
                ]
            },
            metadata: {
                title,
                restrictions,
                preferences
            }
        });
        return thread;
    });
}
function addMessages(threadId, message) {
    return __awaiter(this, void 0, void 0, function* () {
        yield openai.beta.threads.messages.create(threadId, {
            role: "user",
            content: message
        });
        return void 0;
    });
}
function startRun(threadId, dataCB, dataEnd) {
    return __awaiter(this, void 0, void 0, function* () {
        assistantHelperStream(threadId, dataCB, dataEnd);
    });
}
function getThreadMessages(threadId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield openai.beta.threads.messages.list(threadId);
        return result;
    });
}
function getLastMessage(threadId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield getThreadMessages(threadId);
        const lastMessage = result.data[0].content;
        return lastMessage;
    });
}
function getThread(threadId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield openai.beta.threads.runs.list(threadId);
        const lastRun = result.data[0];
        return lastRun;
    });
}
export { generatePlan, generateShoppingList, generateRecipie, generateRecipies, startThread, addMessages, startRun, getLastMessage, getThread, getThreadMessages };
