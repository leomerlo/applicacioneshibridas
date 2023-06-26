import Avatar from "../components/Avatar"
import { useProfile } from "../contexts/ProfileContext";

export enum WelcomeType {
  h = 'horizontal',
  v = 'vertical'
}

export type Props = {
  mode: WelcomeType;
}

const WelcomeCard = (props: Props) => {
  const { profile } = useProfile();

  const isVertical = () => {
    return props.mode === WelcomeType.v
  }

  return (
    <div className={`flex ${ isVertical() ? "flex-col items-center" : "" }`}>
      <div className="mr-4">
        { <Avatar size={64} /> }
      </div>
      <div className={`${ isVertical() ? "mt-6" : "" }`}>
        <h1 className="text-4xl text-gray-90">Hola, <span className="text-primary-main">{profile.name}</span></h1>
        { isVertical() ? <></> : <p className="text-gray-60">Descubre un mundo de delicias culinarias.</p> }
      </div>
    </div>
  )
}

export default WelcomeCard