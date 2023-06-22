import { Configuration, OpenAIApi } from "openai";
import dotenv from 'dotenv'
import { ObjectId } from "bson";

dotenv.config()

const configuration = new Configuration({
  organization: process.env.OPENAI_ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const model = "text-davinci-003";
const max_tokens = 2064;

async function promptHelper(prompt: string): Promise<string | undefined> {
  try {
    // console.log('Reaching out to openai API with the prompt: ' + prompt);
    const completion = await openai.createCompletion({
      model,
      max_tokens,
      prompt,
    });
    let result = completion.data.choices[0].text;
    result = result?.replace("Answer:", "");
    result = result?.replace("answer:", "");
    result = result?.replace("JSON Response:", "");
    // console.log("openAi Response: ", result);
    return result;
  } catch (error: any) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
    throw new Error("Error en ChatGPT API");
  }
}

async function generatePlan(restrictions: string, preferences: string): Promise<string | undefined> {
  const prompt = `
  Create a meal plan for a week using the following restrictions: '${restrictions}' and preferences: '${preferences}'.
  Place special importance in restrictions as they are more important than preferences.
  Provide breakfast, lunch and dinner for each day of the week including nutricional values as specified in the example.
  
  Format the entire response as a single JSON string without line breaks or words that are not part of the response.
  
  Use this as an example for the format but not the meals or nutrition values:
  {
    "monday": {
      "breakfast": {
        "name": "Oats and chia bowl",
      },
      "lunch": {
        "name": "Spinach and Avocado Salad",
      }
      "dinner": {
        "name": "Tofu and veggies stir fry",
      }
    },
  }
  `
  return await promptHelper(prompt);
}

async function generateRecipie(recipie: string, diners: number): Promise<string | undefined> {
  const prompt = `
  Generate a list of ingredients, steps and nutritional values for ${recipie}.
  Follow these rules when generating it:
  - Ingredients should only use the singular and never plural.
  - Ingredients ammounts should only be expressed in gr and ml. Never use cups, spoons or any other unit.
  - Whole ingredients should only be expressed as units. Never use cloves, pieces or any other unit.
  - Ingredients, and nutritional values should be set for ${diners} diners.
  - Steps should be expressed in up to 10 easy to follow steps.
  Format the entire response as a single JSON string without line breaks or words that are not part of the JSON string. Do not add Answer or any other prefix to the answer, just the JSON string.
  Use this as an example for the format but not the recipie, ingredients or instructions:
  {
    "name": "Oatmeal",
    "ingredients": [
      {
        "name": "Oat",
        "quantity": "100",
        "unit": "gr"
      },
      {
        "name": "Water",
        "quantity": "150",
        "unit": "ml"
      },
      {
        "name": "Salt",
        "quantity": "5",
        "unit": "gr"
      }
    ],
    "instructions": [
      "Boil the water",
      "Add the oats and salt",
      "Cook for 5 minutes"
    ],
    "nutrition": {
      "calories": 300,
      "carbs": 20,
      "fat": 10,
      "protein": 10
    }
  }
  `
  return await promptHelper(prompt);
}

export {
  generatePlan,
  generateRecipie
}