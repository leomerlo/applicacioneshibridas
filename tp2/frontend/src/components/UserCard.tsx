import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { Profile } from '../contexts/ProfileContext'

export type Props = {
  user: Profile,
  onClick: (id: string) => void,
  active?: boolean
}

const UserCard = (props: Props) => {

  const clickHandler = () => {
    props.onClick(props.user._id as string);
  }

  const setClasses = () => {
    let classes = 'rounded-lg border p-4 flex justify-between';
    if (props.active === true) {
      classes += ' border-primary-main bg-white';
    } else {
      classes += ' border-gray-40';
    }
    return classes;
  }

  return (
    <button className="block w-full" onClick={clickHandler}>
      <div className={setClasses()}>
        <div className="flex flex-col text-left">
          <span className="text-gray-80 font-bold">{props.user.name}</span>
        </div>
        <div className="grow flex justify-end items-center px-4 text-primary-main">
          <FontAwesomeIcon icon={faChevronRight} />
        </div>
      </div>
    </button>
  )
}

export default UserCard