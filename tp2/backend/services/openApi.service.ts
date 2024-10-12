import { OpenAI } from "openai";
import dotenv from 'dotenv'
import { Ingredients } from "../types/recipies";
import { RequiredActionFunctionToolCall, Run } from "openai/resources/beta/threads/runs/runs";
import { Thread } from "openai/resources/beta/threads/threads";

dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const model3 = "gpt-3.5-turbo-16k";
const model4 = "gpt-4o-mini";
const temperature = 0;

async function promptHelper(systemPrompt: string, userPrompt: string): Promise<string> {
  try {
    const timeStart = new Date();
    console.log('Start OpenAI fetch', timeStart.getHours(), timeStart.getMinutes(), timeStart.getSeconds());
    const completion = await openai.chat.completions.create({
      model: model3,
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
      temperature: 1
    })
    const timeEnd = new Date();
    const timeDiff = Math.abs((timeStart.getTime() - timeEnd.getTime()) / 1000);
    let result = completion.choices[0].message?.content;
    console.log("Result: ", completion.choices[0].message?.content);
    console.log("openAi usage: ", completion.usage);
    console.log('End OpenAI fetch', timeEnd.getHours(), timeEnd.getMinutes(), timeEnd.getSeconds());
    console.log('Query time: ', timeDiff + 'segs');
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

async function promptHelperJSON(systemPrompt: string, userPrompt: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: model4,
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
      temperature: 0,
      response_format: { 
        type: "json_object"
      }
    })
    let result = completion.choices[0].message?.content;
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

async function promptHelperStream(systemPrompt: string, userPrompt: string, dataCB: (data: string) => void, dataEnd: (data: string) => void): Promise<void> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
      temperature: 0,
      stream: true,
      response_format: { 
        type: "json_object"
      }
    })

    let fullStream = "";

    console.log("Start streaming response");

    for await (const chunk of completion) {
      if(chunk.choices[0].delta.content != undefined) {
        fullStream = chunk.choices[0].delta.content;
        dataCB(fullStream);
      } else {
        console.log("End streaming response");
        dataEnd(fullStream);
      }
    }

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

async function generatePlan(restrictions: string, preferences: string, recipies: string): Promise<string> {
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
  `

  const userPrompt = `
    Quiero un plan de comidas que cumpla con las siguientes restricciones y preferencias:
    Restricciones: ${restrictions}

    Preferencias: ${preferences}

    Ejemplos: ${recipies}
  `;

  return await promptHelper(systemPrompt, userPrompt);
}

async function generateShoppingList(ingredients: Ingredients[]): Promise<string> {
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

  return await promptHelper(systemPrompt, userPrompt);
}

async function generateRecipie(restrictions: string, preferences: string, recipies: string, day: string, meal: string, dataCB: (data: string) => void, dataEnd: (data: string) => void): Promise<void> {
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
  `

  const userPrompt = `
    Quiero una receta con las siguientes restricciones y preferencias:
    Restricciones: ${restrictions}

    Preferencias: ${preferences}

    La receta no debe ser ninguna ni muy similar a estas: ${recipies}
  `;

  return await promptHelperStream(systemPrompt, userPrompt, dataCB, dataEnd);
}

async function generateRecipies(restrictions: string, preferences: string, listado: any) {
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

  Usa esto como ejemplo manteniendo los nombres en inglés para el formato pero no para las comidas o valores nutricionales:
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

  return await promptHelper(systemPrompt, userPrompt);
}

async function startThread(title: string, restrictions: string, preferences: string): Promise<Run> {
  const thread = await openai.beta.threads.createAndRun({
    assistant_id: "asst_XbEObay3S8R1P6eU5QGWESuy",
    instructions: `
    Cuando te pida ayuda, vas a actuar como un jefe de cocina y asistir a un nutricionista para armar un plan de comida semanal para un paciente, siguiendo las "restricciones" y "preferencias" especificadas en la metadata del chat.

    Restricciones: ${restrictions}

    Preferencias: ${preferences}
 
    Las restricciones son más importantes que las preferencias. Las restricciones son lo mas importante de todo ya que una restriccion que no se siga puede resultar en problemas.

    Las preferencias son menos importantes que las restricciones, pero aun asi son importantes.

    El plan de comida debe incluir desayuno, almuerzo y cena para cada dia de la semana.

    Durante el chat, solo devolve los titulos de las comidas, sin ingredientes ni instrucciones.
    `,
    metadata: {
      title,
      restrictions,
      preferences
    }
  });

  let run;

  do {
    run = await openai.beta.threads.runs.retrieve(thread.thread_id, thread.id);
    await new Promise(r => setTimeout(r, 2000));
  } while (run.status !== "completed");

  return thread;
}

async function addMessages(threadId: string, message: string) {
  await openai.beta.threads.messages.create(
    threadId,
    {
      role: "user",
      content: message
    }
  );

  return void 0;
}

async function startRun(threadId: string, assistant: 'message' | 'plan' ,dataCB: (data: string) => void, dataEnd: (data: unknown) => void) {
  const assistant_id = assistant === 'message' ? "asst_XbEObay3S8R1P6eU5QGWESuy" : "asst_VgpCeGz34c0CmjfIRfINHL4o";
  const thread = await openai.beta.threads.retrieve(threadId);
  const threadMeta = thread.metadata as {
    restrictions: string,
    preferences: string,
    title: string
  };
  try {
    const run = await openai.beta.threads.runs.create(
      threadId,
      { 
        assistant_id: assistant_id,
        stream: true,
        additional_instructions: `Restricciones: ${threadMeta.restrictions} Preferencias: ${threadMeta.preferences}`
      }
    );

    for await (const event of run) {
      // console.log("-- Event", event.event);
      if (event.event === "thread.run.step.delta") {
        // console.log("-- Event Delta");
      } else if (event.event === "thread.run.requires_action") { 
        try {
          // console.log("-- Event Requires Action");
          const threadId = event.data.thread_id;
          const tool_calls = event.data.required_action?.submit_tool_outputs.tool_calls;
          const tool_outputs = tool_calls?.map((tool: RequiredActionFunctionToolCall) => {
            console.log(tool.function.name);
            if (tool.function.name === "day_planner") {
              const args = JSON.parse(tool.function.arguments);
              dataCB(args);
              return { 
                tool_call_id: tool.id,
                output: "success"
              };
            }
          });
          await submitToolOutputs(tool_outputs, event.data.id, threadId);
          dataEnd("");
        } catch (error) {
          // console.log(error);
        }
      } else if (event.event === "thread.message.delta" && event.data.delta.content && event.data.delta.content.length > -1) {
        const response = event.data.delta.content[0].text.value;
        dataCB(response);
      } else if (event.event === "thread.message.completed") {
        dataEnd(event);
      }
    }
  } catch (error) {
    // openai.beta.threads.runs.cancel(threadId, event.data.id);
    console.log("Run failed", error);
  }
}

async function getThreadMessages(threadId: string) {
  const result = await openai.beta.threads.messages.list(threadId);
  return result;
}

async function removeLastMessages(threadId: string, limit: number = 2) {
  const result = await openai.beta.threads.messages.list(threadId, { limit });
  // console.log("-- Message cleanup");
  try {
    await result.data.map(async (message) => {
      await openai.beta.threads.messages.del(threadId, message.id)
    });
    return void 0;
  } catch (error) {
    console.error("Error removing messages:", error);
  }
}

async function getLastMessage(threadId: string) {
  const result = await getThreadMessages(threadId);
  const lastMessage = result.data[0].content;

  return lastMessage;
}

async function getThread(threadId: string) {
  const result = await openai.beta.threads.runs.list(threadId);
  const lastRun = result.data[0];
  return lastRun;
}

async function submitToolOutputs(tool: any, runId: string, threadId: string) {
  try {
    console.log(tool);
    // Use the submitToolOutputsStream helper
    const stream = openai.beta.threads.runs.submitToolOutputsStream(
      threadId,
      runId,
      { tool_outputs: tool },
    );
    for await (const event of stream) {
      if(event.event === "thread.run.completed") {
        return event; 
      }
    }
  } catch (error) {
    console.error("Error submitting tool outputs:", error);
  }
}

export {
  generatePlan,
  generateShoppingList,
  generateRecipie,
  generateRecipies,
  startThread,
  addMessages,
  startRun,
  getLastMessage,
  getThread,
  getThreadMessages,
  removeLastMessages
}