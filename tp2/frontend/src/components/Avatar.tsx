// @ts-ignore
import { Identicon } from '@nichoth/identicon';
import { useProfile } from "../contexts/ProfileContext";

export type Props = {
  size?: number;
}

const Avatar = (props: Props) => {
  const { profile } = useProfile();

  // create a base64 encoded PNG
  const hash = profile._id || '000000000000000';
  const options = {
    foreground: [255, 255, 255, 255],
    background: [94, 71, 210, 255],
    margin: 0.25,
    size: props.size,
    format: 'svg'
  };
  const data = new Identicon(hash, options).toString();

  return (
    <img width={props.size} height={props.size} src={`data:image/svg+xml;base64,${data}`} className="rounded-full" />
  )
}

export default Avatar