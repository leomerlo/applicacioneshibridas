import cardGradient from "../assets/cardGradient.svg"

const FeaturedMealCard = () => {
  return (
    <div
      style={{'--image-url': `url(${cardGradient})`}}
      className="flex flex-col p-6 bg-[image:var(--image-url)] bg-cover rounded-lg mt-6"
    >
      <h2 className="text-xl text-white">Champiñones Rellenos</h2>
      <span className="text-gray-40">Almuerzo</span>
      <ul className="text-sm text-gray-10 mt-4">
        <li><span className="font-bold">Calorias:</span> 560</li>
        <li><span className="font-bold">Calorias:</span> 560</li>
        <li><span className="font-bold">Calorias:</span> 560</li>
      </ul>
      <div className="flex mt-6">
        <span className="inline-block bg-info-secondary text-info-main text-xs px-2 rounded-full uppercase font-semibold tracking-wide mr-2">Champignones</span> <span className="inline-block bg-info-secondary text-info-main text-xs px-2 rounded-full uppercase font-semibold tracking-wide">Espinacas</span>
      </div>
    </div>
  )
}

export default FeaturedMealCard