import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck } from "@fortawesome/free-solid-svg-icons"

export type Props = {
  checked: boolean,
  onClick: () => void,
}

const FalseCheck = (props: Props) => {
  return (
    <button className={`${ props.checked ? "bg-primary-main text-gray-10" : "border bg-gray-10" } rounded-sm w-5 h-5 flex justify-center items-center mt-1`} onClick={props.onClick}>
      { props.checked ? <FontAwesomeIcon icon={faCheck} /> : <></> }
    </button>
  )
}

export default FalseCheck