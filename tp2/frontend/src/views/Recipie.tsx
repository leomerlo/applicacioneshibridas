import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons"
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons"
import MealIcon, { IconSizes } from "../components/MealIcon"
import { MealTypes } from "../components/NextMeals/NextMealItem"
import RecipieTabs from "../components/RecipieTabs"
import GoBack from "../components/GoBack"


const Recipie = () => {

  const isLiked = false;

  return (
    <div className="container mx-auto">
      <div className="flex justify-between">
        <GoBack />
        <div>
          <button className="flex items-center justify-between">
            <FontAwesomeIcon icon={isLiked ? faHeartSolid : faHeartRegular} className="text-xl" />
            <span className="text-gray-90 ms-2">120</span>
          </button>
        </div>
      </div>
      <div className="mt-6">
        <div className="text-4xl mx-auto w-fit">
          <MealIcon size={IconSizes.medium} type={MealTypes.dinner} />
        </div>
        <h1 className="text-4xl text-gray-90 text-center mt-3">Ensalada de Quinoa y Palta</h1>
      </div>
      <RecipieTabs />
    </div>
  )
}

export default Recipie