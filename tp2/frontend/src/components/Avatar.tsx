import { Identicon } from '@nichoth/identicon';

export type Props = {
  size?: number;
}

const Avatar = (props: Props) => {

  // create a base64 encoded PNG
  const hash = '6484b884a81f0c4c3def6f0a';
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