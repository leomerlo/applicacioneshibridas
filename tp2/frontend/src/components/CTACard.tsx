import cardGradient from "../assets/pattern_azul_lg.png"
import Button from "./Button"

interface Props {
  title: string;
  description: string;
  ctaText: string;
  ctaAction: () => void;
}

const CTACard = (props: Props) => {
  return (
    <div
      // @ts-ignore 
      style={{'--image-url': `url(${cardGradient})`}}
      className="flex flex-col gap-4 p-6 bg-[image:var(--image-url)] rounded-lg bg-cover"
    >
      <h2 className="text-heading-sm text-white leading-tight">{props.title}</h2>
      <span className="text-body-sm text-white">{props.description}</span>
      <Button variant="secondary" className="mt-4" onClick={props.ctaAction}>{props.ctaText}</Button>
    </div>
  )
}

export default CTACard