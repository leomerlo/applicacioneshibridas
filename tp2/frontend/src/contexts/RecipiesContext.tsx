import { createContext, useState, useEffect, PropsWithChildren, useContext } from "react"
import recipiesService from "../services/recipies.service";
import { useParams } from "react-router-dom";

export type Ingredients = {
  name: string;
  quantity: number;
  unit: string;
}

export type Nutrition = {
  calories: number,
  carbs: number,
  fat: number,
  protein: number
}

export type Recipie = {
  _id?: string;
  name: string;
  ingredients: Ingredients[];
  instructions: string[];
  likes?: string[],
  nutrition: Nutrition
}

const emptyRecipie: Recipie = {
  name: '',
  ingredients: [],
  instructions: [],
  nutrition: {
    calories: 0,
    carbs: 0,
    fat: 0,
    protein: 0
  }
};

const RecipieContext = createContext({
  recipie: emptyRecipie,
  loading: false,
  userSteps: [],
  // @ts-ignore
  setSteps: (steps: number[]) => {},
  userIngredients: [],
  // @ts-ignore
  setIngredients: (ingredients: Ingredients[]) => {},
  recipieError: [],
})

function useRecipie(){
  return useContext(RecipieContext)
}

function RecipieProvider({children}: PropsWithChildren){
  const { name, profileId } = useParams();
  const [recipieError, setRecipieError] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recipie, setRecipie] = useState<Recipie>(emptyRecipie);
  const [userSteps, setUserSteps] = useState<number[]>([])
  const [userIngredients, setUserIngredients] = useState<Ingredients[]>([])

  useEffect(() => {
    setLoading(true);
    const getRecipieData = {
      name: name as string,
      profileId: profileId || null
    }
    recipiesService.getRecipie(getRecipieData).then((res) => {
      setLoading(false);
      if(res.status === 200) {
        setRecipie(res.data)
      } else {
        setRecipieError(res.data.error.message);
      }
    });
  }, []);

  const setSteps = (steps: number[]) => {
    setUserSteps(steps);
  }

  const setIngredients = (ingredients: Ingredients[]) => {
    setUserIngredients(ingredients);
  }
  
  return (
    // @ts-ignore
    <RecipieContext.Provider value={{ recipie, loading, userSteps, userIngredients, setSteps, setIngredients, recipieError }}>
      {children}
    </RecipieContext.Provider>
  )
}

export {
  useRecipie,
  RecipieProvider
}