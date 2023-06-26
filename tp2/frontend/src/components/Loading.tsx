import loadingGif from '../assets/loading.gif'
import loadingImage from '../assets/girlPhone.png'
import GoBack from '../components/GoBack'

export type Props = {
  action: string
  subtext?: string
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
        <img src={loadingImage} aria-hidden className="mt-4" />
      </div>
      <h1 className="text-4xl text-gray-90 text-center mt-3">{props.action}</h1>
      <p className="text-xl text-gray-60 text-center mt-2">{props.subtext || "Aguardá unos instantes."}</p>
    </div>
    </>
  )
}

export default Loading