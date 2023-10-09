export type Props = {
  active?: boolean;
  day: string;
  onClick: () => void
}

const DaysCarouselItem = (props: Props) => {
  return (
    <div className="flex flex-1 flex-col">
      <button className={`${ props.active ? "bg-primary-main text-gray-10 border-gray-10" : "bg-white text-gray-50 border-gray-50" } border p-4 rounded-lg items-center justify-center`} onClick={props.onClick}>{props.day}</button>
    </div>
  )
}

export default DaysCarouselItem