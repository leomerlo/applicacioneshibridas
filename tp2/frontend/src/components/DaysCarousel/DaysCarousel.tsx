import DaysCarouselItem from './DaysCarouselItem'

const DaysCarousel = () => {
  return (
    <div className="flex mt-6 gap-4">
      <DaysCarouselItem day="Vie" date="09" active />
      <DaysCarouselItem day="Sab" date="10" />
      <DaysCarouselItem day="Sab" date="10" />
      <DaysCarouselItem day="Sab" date="10" />
      <DaysCarouselItem day="Sab" date="10" />
      <DaysCarouselItem day="Sab" date="10" />
      <DaysCarouselItem day="Sab" date="10" />
    </div>
  )
}

export default DaysCarousel