import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { Profile } from '../contexts/ProfileContext'

export type Props = {
  user: Profile
}

const UserCard = (props: Props) => {
  return (
    <div className="bg-white rounded-lg border-gray-20 border p-4 mb-3 flex justify-between">
      <Link to={`/admin/user/${props.user._id}`} className="flex-grow flex">
        <div className="flex flex-col">
          <span className="text-gray-80 font-bold">{props.user.name}</span>
        </div>
        <div className="grow flex justify-end items-center px-4 text-primary-main">
          <FontAwesomeIcon icon={faChevronRight} />
        </div>
      </Link>
    </div>
  )
}

export default UserCard