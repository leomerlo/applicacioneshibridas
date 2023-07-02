export type Props = {
  active?: boolean;
  day: string;
  date: string;
}

const DaysCarouselItem = (props: Props) => {
  return (
    <div className={`flex flex-1 flex-col ${ props.active ? "bg-primary-main text-gray-10 border-gray-10" : "bg-white text-gray-50 border-gray-50" } border p-4 rounded-lg items-center justify-center`}>
      <span>{props.day}</span>
      <span className="text-2xl">{props.date}</span>
    </div>
  )
}

export default DaysCarouselItem