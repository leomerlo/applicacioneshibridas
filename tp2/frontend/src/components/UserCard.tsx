import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { Profile } from '../contexts/ProfileContext'
import Badge from './Badge'

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
        <div className="flex items-center gap-2 text-left">
          { props.user.accountType === 'doc' && props.user.status === 'pending' ? <FontAwesomeIcon icon={faCircleExclamation} /> : <></> }
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