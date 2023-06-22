import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons"
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons"
import RecipieTabs from "../components/RecipieTabs"
import GoBack from "../components/GoBack"
import recipie_1 from '../assets/recipie_1.png'
import recipie_2 from '../assets/recipie_2.png'
import recipie_3 from '../assets/recipie_3.png'
import recipie_4 from '../assets/recipie_4.png'
import loadingImage from '../assets/girlPhone.png'
import loadingGif from '../assets/loading.gif'
import { useProfile } from "../contexts/ProfileContext"
import { useRecipie } from "../contexts/RecipiesContext"
import recipiesService from "../services/recipies.service"

const Recipie = () => {
  const recipieImages = [recipie_1, recipie_2, recipie_3, recipie_4];
  const { name } = useParams();
  const { recipie, loading, recipieError } = useRecipie();
  const profile = useProfile();
  const [image, setImage] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLiked(recipie.likes?.includes(profile._id) || false);
  }, [recipie]);

  useEffect(() => {
    setImage(recipieImages[Math.floor(Math.random() * recipieImages.length)]);
  }, [name]);

  useEffect(() => {
    setIsLoading(!isLoading);
  }, [loading]);

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
          recipie.likes = recipie.likes?.filter((id) => id !== profile._id);
        } else {
          recipie.likes?.push(profile._id as string);
        }
        setIsLiked(!isLiked);
      }
    })
  }

  return (
    <div className="container mx-auto">
      <div>
        {
          loading ?
          <>
            <div className="flex justify-between">
              <GoBack />
            </div>
            <div className="mt-6">
              <div className="text-4xl mx-auto w-fit text-center">
                <img src={loadingGif} alt="loading" className="mx-auto" />
                <img src={loadingImage} aria-hidden className="mt-4" />
              </div>
              <h1 className="text-4xl text-gray-90 text-center mt-3">FoodGenie está escribiendo tu receta.</h1>
              <p className="text-xl text-gray-60 text-center mt-2">Aguardá unos instantes.</p>
            </div>
          </>
          :
          <>
            <div className="flex justify-between">
              <GoBack />
              <div>
                <button className="flex items-center justify-between" onClick={likeButtonHandler}>
                  <FontAwesomeIcon icon={isLiked ? faHeartSolid : faHeartRegular} className="text-xl" />
                  <span className="text-gray-90 ms-2">{recipie.likes?.length || 0}</span>
                </button>
              </div>
            </div>
            {
              recipieError && recipieError.length > 0 
              ?
              <>
                <div className="mt-6">
                  <div className="text-4xl mx-auto w-fit">
                    <img src={image} aria-hidden />
                  </div>
                  <h1 className="text-4xl text-gray-90 text-center mt-3 capitalize">Hubo un error en tu receta.</h1>
                  <p className="text-xl text-gray-60 text-center mt-2">Por favor, intentalo nuevamente.</p>
                  <button className="block mx-auto w-fit mt-4" onClick={() => { location.reload() }}>Recargar</button>
                </div>
              </>
              :
              <>
                <div className="mt-6">
                  <div className="text-4xl mx-auto w-fit">
                    <img src={image} aria-hidden />
                  </div>
                  <h1 className="text-4xl text-gray-90 text-center mt-3 capitalize">{recipie.name}</h1>
                </div>
                <RecipieTabs />
              </>
            }
          </>
        }
      </div>
    </div>
  )
}

export default Recipie