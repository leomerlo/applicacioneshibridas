import DaysCarouselItem from './DaysCarouselItem'

export type Props = {
  day: string,
  onDayChange: (day: string) => void
}

const DaysCarousel = (props: Props) => {
  return (
    <div className="flex mt-6 gap-4 w-full overflow-hidden scroll-auto">
      <DaysCarouselItem onClick={() => {props.onDayChange("friday")}} day="Vie" active={props.day === 'friday'} />
      <DaysCarouselItem onClick={() => {props.onDayChange("saturday")}} day="Sab" active={props.day === 'saturday'} />
      <DaysCarouselItem onClick={() => {props.onDayChange("sunday")}} day="Dom" active={props.day === 'sunday'} />
      <DaysCarouselItem onClick={() => {props.onDayChange("monday")}} day="Lun" active={props.day === 'monday'} />
      <DaysCarouselItem onClick={() => {props.onDayChange("tuesday")}} day="Mar" active={props.day === 'tuesday'} />
      <DaysCarouselItem onClick={() => {props.onDayChange("wednesday")}} day="Mier" active={props.day === 'wednesday'} />
      <DaysCarouselItem onClick={() => {props.onDayChange("thursday")}} day="Jue" active={props.day === 'thursday'} />
    </div>
  )
}

export default DaysCarousel