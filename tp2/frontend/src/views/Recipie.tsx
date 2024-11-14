import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import GoBack from "../components/GoBack"
import recipie_1 from '../assets/recipie_1.png'
import recipie_2 from '../assets/recipie_2.png'
import recipie_3 from '../assets/recipie_3.png'
import recipie_4 from '../assets/recipie_4.png'
import { useProfile } from "../contexts/ProfileContext"
import { useRecipie } from "../contexts/RecipiesContext"
import recipiesService from "../services/recipies.service"
import Loading from "../components/Loading"
import RecipieIngredients from "../components/RecipieIngredients"
import RecipieSteps from "../components/RecipieSteps"
import cardGradient from "../assets/pattern_azul_lg.png"
import planService from "../services/plan.service"
import { usePlan } from "../contexts/PlanContext"
import { useNavigate } from "react-router-dom"

const Recipie = () => {
  const recipieImages = [recipie_1, recipie_2, recipie_3, recipie_4];
  const { name } = useParams();
  const { recipie, loading, recipieError } = useRecipie();
  const { plan, updatePlan, planSelectedDay, planSelectedMeal } = usePlan();
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setImage(recipieImages[Math.floor(Math.random() * recipieImages.length)]);
  }, [name]);

  const translateMeal = (meal: string): string => {
    switch(meal) {
      case 'Desayuno':
        return 'breakfast';
      case 'Almuerzo':
        return 'lunch';
      case 'Cena':
        return 'dinner';
      default:
        return '';
    }
  }

  const replaceRecipieHandler = async () => {
    let fullChunk = "";
    const translatedMeal = translateMeal(planSelectedMeal);

    if (translatedMeal === "") {
      throw new Error('No existe la comida.')
    }

    await setLoadingIngredients(true);
    await setLoadingInstructions(true);
    await setLoadingNutrition(true);
    await setIsLoading(true);

    planService.replaceRecipie(planSelectedDay, translatedMeal, (data: any) => {
      fullChunk += new TextDecoder().decode(data);
      includesIngredients(fullChunk);
      includesInstructions(fullChunk);
      includesNutrition(fullChunk);
    }, async () => {
      await updatePlan();
      setTimeout(() => {
        setIsLoading(false);
        navigate('/plan');
      }, 1000);
    });
  }

  return (
    <div className="container-fluid max-w-mobile mx-auto px-8 my-12">
      <div>
        {
          isLoading || loading ?
          <>
            <Loading action="Cargando receta..." />
          </>
          :
          <>
            <GoBack />
            {
              recipieError && recipieError.length > 0 
              ?
              <>
                <div className="mt-6">
                  <div className="text-4xl mx-auto w-fit">
                    <img src={image} aria-hidden />
                  </div>
                  <h1 className="text-4xl text-gray-90 text-center mt-3 capitalize">Hubo un error en tu receta.</h1>
                  <p className="text-xl text-gray-60 text-center mt-2">Por favor, intentálo nuevamente.</p>
                  <button className="block mx-auto w-fit mt-4" onClick={() => { location.reload() }}>Recargar</button>
                </div>
              </>
              :
              <>
                <div className="flex flex-col gap-6 mt-12">
                  <div>
                    <h1 className="text-4xl text-gray-90 text-left">{recipie.name}</h1>
                    {/* { isUser ? <Button variant="secondary" onClick={replaceRecipieHandler}>Reemplazar esta receta</Button> : '' } */}
                  </div>

                  <div
                    // @ts-ignore 
                    style={{'--image-url': `url(${cardGradient})`}}
                    className="flex flex-col p-10 gap-4 bg-[image:var(--image-url)] m-row bg-cover mt-6 text-white"
                  >
                    <span className="font-bold text-xl">Ingredientes</span>
                    <RecipieIngredients />
                  </div>

                  <div>
                    <span className="font-bold text-xl">Receta</span>
                    <RecipieSteps />
                  </div>
                </div>
              </>
            }
          </>
        }
      </div>
    </div>
  )
}

export default Recipie