import cardGradient from '../assets/cardGradient.svg'
import { PropsWithChildren } from 'react';

export type Props = {
  title: String;
}

const GradientCard = (props: PropsWithChildren<Props>) => {
  return (
    <div
      // @ts-ignore 
      style={{'--image-url': `url(${cardGradient})`}}
      className="flex flex-1 flex-col p-10 bg-[image:var(--image-url)] bg-cover rounded-lg mt-6"
    >
      <h2 className="text-xl text-white mb-2">{props.title}</h2>
        {props.children}
    </div>
  )
}

export default GradientCard