import { PropsWithChildren } from 'react';

export enum ButtonType {
  submit = 'submit',
  button = 'button'
}

type ButtonProps = {
  onClick?: () => void;
  full?: boolean;
  type?: ButtonType;
}

const defaultProps: ButtonProps = {
  type: ButtonType.button,
}

const Button = (props: PropsWithChildren<ButtonProps>) => {
  return (
    <button type={props.type} className={`py-2.5 px-4 bg-primary-main focus:bg-primary-focus focus:text-grey-100 hover:bg-primary-hover active:bg-primary-pressed text-white text-base rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 ${props.full ? 'w-full' : '' }`} onClick={props.onClick}>
      { props.children }
    </button>
  )
}

Button.defaultProps = defaultProps;

export default Button