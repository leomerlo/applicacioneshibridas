import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

const GoBack = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  }

  return (
    <button className="text-primary-main" onClick={goBack}>
      <FontAwesomeIcon icon={faChevronLeft} className="mr-3" />
      <span className="border-b-primary-main border-b">Regresar</span>
    </button>
  )
}

export default GoBack