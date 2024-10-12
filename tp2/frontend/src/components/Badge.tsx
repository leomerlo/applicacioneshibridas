export interface Props {
  text: string
}

const Badge = (props: Props) => {
  return (
    <span className="bg-gray-20 rounded-lg text-xs text-gray-100 py-1 px-2">
      {props.text}
    </span>
  )
}

export default Badge