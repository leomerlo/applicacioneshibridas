import { PropsWithChildren } from 'react';

export enum ButtonType {
  submit = 'submit',
  button = 'button'
}

type ButtonProps = {
  onClick?: () => void;
  full?: boolean;
  type?: ButtonType;
  className?: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
}

const defaultProps: ButtonProps = {
  type: ButtonType.button,
}

const Button = (props: PropsWithChildren<ButtonProps>) => {
  const variantClasses = (): String => {

    switch(props.variant) {
      case 'primary':
      default:
        return 'bg-primary-main focus:bg-primary-focus hover:bg-primary-hover active:bg-primary-pressed text-white';
      case 'secondary':
        return 'bg-white focus:bg-secondary-focus hover:bg-secondary-hover active:bg-secondary-pressed text-primary-main';
      case 'tertiary':
        return 'bg-tertiary-main focus:bg-tertiary-focus hover:bg-tertiary-hover active:bg-tertiary-pressed text-white';
    }
  }

  return (
    <button type={props.type} className={ `${props.className} py-2.5 px-4 text-base rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 ${props.full ? 'w-full' : '' } ${variantClasses()}` } onClick={props.onClick}>
      { props.children }
    </button>
  )
}

Button.defaultProps = defaultProps;

export default Button