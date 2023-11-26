import loadingGif from '../assets/loading.gif'
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export type Props = {
  action: string
  subtext?: string
  items?: {
    label: string,
    loading: boolean
  }[]
}

const Loading = (props: Props) => {
  return (
    <>
    {/* <div className="flex justify-between">
      <GoBack />
    </div> */}
    <div className="mt-6">
      <div className="text-4xl mx-auto w-fit text-center">
        <img src={loadingGif} alt="loading" className="mx-auto" />
      </div>
      <h1 className="text-4xl text-gray-90 text-center mt-3">{props.action}</h1>
      <p className="text-xl text-gray-60 text-center mt-2">{props.subtext || "Esto puede tomar unos minutos."}</p>
      { props.items ? <div className="text-2xl my-3 mx-auto w-fit text-center">
        <ul>
          { props.items.map((item) => (
            <li key={item.label}>
              <span>{item.label}</span>
              <span className="ms-3">
                { item.loading ?
                  <FontAwesomeIcon icon={faCircleXmark} />
                  :
                  <FontAwesomeIcon icon={faCircleCheck} />
                }
              </span>
            </li>
          )) }
        </ul>
      </div>
      : <></> }
    </div>
    </>
  )
}

export default Loading