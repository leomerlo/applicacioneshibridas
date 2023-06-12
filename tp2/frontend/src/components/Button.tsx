import { PropsWithChildren } from 'react';

type ButtonProps = {
  onClick: () => void;
  full?: boolean;
}

const Button = (props: PropsWithChildren<ButtonProps>) => {
  return (
    <button className={`py-2.5 px-4 bg-primary-main focus:bg-primary-focus focus:text-grey-100 hover:bg-primary-hover active:bg-primary-pressed text-white text-base rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 ${props.full ? 'w-full' : '' }`} type="button" onClick={props.onClick}>
      { props.children }
    </button>
  )
}

export default Button