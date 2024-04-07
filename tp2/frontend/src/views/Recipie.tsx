import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons"
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons"
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
import HeadDivider from "../components/HeadDivider"
import Button from "../components/Button"
import planService from "../services/plan.service"
import { usePlan } from "../contexts/PlanContext"
import { useNavigate } from "react-router-dom"

const Recipie = () => {
  const recipieImages = [recipie_1, recipie_2, recipie_3, recipie_4];
  const { name } = useParams();
  const { recipie, loading, recipieError } = useRecipie();
  const { profile, isUser } = useProfile();
  const { updatePlan, planSelectedDay, planSelectedMeal } = usePlan();
  const [image, setImage] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingIngredients, setLoadingIngredients] = useState(false);
  const [loadingInstructions, setLoadingInstructions] = useState(false);
  const [loadingNutrition, setLoadingNutrition] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // @ts-ignore
    setIsLiked(recipie.likes?.includes(profile._id) || false);
  }, [recipie]);

  useEffect(() => {
    setImage(recipieImages[Math.floor(Math.random() * recipieImages.length)]);
  }, [name]);

  const likeButtonHandler = () => {
    let service;
    if(isLiked) {
      service = recipiesService.unLikeRecipie;
    } else {
      service = recipiesService.likeRecipie;
    }

    service(recipie._id as string).then((res) => {
      if(res.status === 201){
        if(isLiked) {
          // @ts-ignore
          recipie.likes = recipie.likes?.filter((id) => id !== profile._id);
        } else {
          // @ts-ignore
          recipie.likes?.push(profile._id as string);
        }
        setIsLiked(!isLiked);
      }
    })
  }

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

  const includesIngredients = (stream: string) => {
    if (stream.includes('"ingredients":')) {
      setLoadingIngredients(false);
    }
  }

  const includesInstructions = (stream: string) => {
    if (stream.includes('"instructions":')) {
      setLoadingInstructions(false);
    }
  }

  const includesNutrition = (stream: string) => {
    if (stream.includes('"nutrition":')) {
      setLoadingNutrition(false);
    }
  }

  return (
    <div className="container mx-auto">
      <div>
        {
          isLoading || loading ?
          <>
            <Loading action="Cargando receta..." items={[
              {
                label: 'Ingredientes',
                loading: loadingIngredients
              },
              {
                label: 'Instrucciones',
                loading: loadingInstructions
              },
              {
                label: 'Nutrición',
                loading: loadingNutrition
              }
            ]} />
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
                <div className="mt-6">
                  <div className="flex justify-between">
                    <h1 className="text-4xl text-gray-90 text-left mt-3">{recipie.name}</h1>
                    { isUser ? <Button variant="secondary" onClick={replaceRecipieHandler}>Reemplazar esta receta</Button> : '' }
                  </div>
                </div>

                <HeadDivider>
                  <button className="flex items-center justify-between" onClick={likeButtonHandler}>
                    <FontAwesomeIcon icon={isLiked ? faHeartSolid : faHeartRegular} className="text-xl" />
                    <span className="text-gray-90 ms-2">{recipie.likes?.length || 0}</span>
                  </button>
                </HeadDivider>

                <div className="pb-4 bg-dividerLineBlocks bg-dividerLineBlocksBottom">
                  <div className="pt-6">
                    <span className="font-bold text-xl">Ingredientes</span>
                  </div>

                  <RecipieIngredients />
                </div>

                <div className="pt-6">
                  <span className="font-bold text-xl">Receta</span>
                </div>
                
                <RecipieSteps />
              </>
            }
          </>
        }
      </div>
    </div>
  )
}

export default Recipie