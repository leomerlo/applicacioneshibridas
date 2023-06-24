import { Configuration, OpenAIApi } from "openai";
import dotenv from 'dotenv'
import { ObjectId } from "bson";

dotenv.config()

const configuration = new Configuration({
  organization: process.env.OPENAI_ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const model = "gpt-3.5-turbo-16k";
const temperature = 0;

async function promptHelper(systemPrompt: string, userPrompt: string): Promise<string> {
  try {
    // console.log('Reaching out to openai API with the prompt: ' + prompt);
    const completion = await openai.createChatCompletion({
      model,
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
      temperature
    });
    let result = completion.data.choices[0].message?.content;
    console.log("openAi usage: ", completion.data.usage);
    return result as string;
  } catch (error: any) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
    throw new Error(error);
  }
}

async function generatePlan(restrictions: string, preferences: string): Promise<string> {
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

  Formatea la respuesta completa como un solo string JSON sin saltos de linea o palabras que no sean parte de la respuesta.

  Usa esto como ejemplo para el formato pero no para las comidas o valores nutricionales:
  {
    "monday": {
      "breakfast": {
        name: yup.string().required(),
        ingredients: yup.array().of(yup.object({
          name: yup.string().lowercase().required(),
          quantity: yup.mixed().required(),
          unit: yup.string()
        })).required(),
        instructions: yup.array().of(yup.string().required()).required(),
        nutrition: yup.object({
          calorias: yup.number(),
          carbohidratos: yup.number(),
          grasas: yup.number(),
          proteinas: yup.number()
        }).required()
      }
    }
  }
  `

  const userPrompt = `
    Quiero un plan de comidas que cumpla con las siguientes restricciones y preferencias:
    Restricciones: ${restrictions}

    Preferencias: ${preferences}
  `;

  return await promptHelper(systemPrompt, userPrompt);
}

export {
  generatePlan
}