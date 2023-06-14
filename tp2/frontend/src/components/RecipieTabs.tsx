import { useState } from "react"
import RecipieSteps from "./RecipieSteps";
import RecipieIngredients from "./RecipieIngredients";
import RecipieNutrition from "./RecipieNutrition";

export enum RecipieTabsEnum {
  recipie = 'Receta',
  ingredients = 'Ingredientes',
  nutrition = 'Nutricion'
}

const RecipieTabs = () => {
  const [active, setActive] = useState<RecipieTabsEnum>(RecipieTabsEnum.recipie);

  const recipieClickHandler = () => {
    setActive(RecipieTabsEnum.recipie);
  }

  const ingredientsClickHandler = () => {
    setActive(RecipieTabsEnum.ingredients);
  }

  const nutritionClickHandler = () => {
    setActive(RecipieTabsEnum.nutrition);
  }

  return (
    <div className="mt-6">
      <div>
        <div className="flex justify-center border-b border-b-gray-40">
          <button className={`${active === RecipieTabsEnum.recipie ? 'border-b-primary-main' : 'border-b-transparent'} grow border-b-2 pt-4 pb-2 px-3`} onClick={recipieClickHandler}>RECETA</button>
          <button className={`${active === RecipieTabsEnum.ingredients ? 'border-b-primary-main' : 'border-b-transparent'} border-b-2 grow pt-4 pb-2 px-3`} onClick={ingredientsClickHandler}>INGREDIENTES</button>
          <button className={`${active === RecipieTabsEnum.nutrition ? 'border-b-primary-main' : 'border-b-transparent'} border-b-2 grow pt-4 pb-2 px-3`} onClick={nutritionClickHandler}>NUTRICION</button>
        </div>
      </div>
      { 
        active === RecipieTabsEnum.recipie ? 
          <RecipieSteps />
        :
          <></>
      }
      { 
        active === RecipieTabsEnum.ingredients ? 
          <RecipieIngredients />
        :
          <></>
      }
      { 
        active === RecipieTabsEnum.nutrition ? 
          <RecipieNutrition />
        :
          <></>
      }
    </div>
  )
}

export default RecipieTabs