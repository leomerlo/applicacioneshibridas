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
  loading?: boolean;
}

const defaultProps: ButtonProps = {
  type: ButtonType.button,
  loading: false
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
    <button type={props.type} className={ `${props.className} py-2.5 px-4 text-base rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 ${props.full ? 'w-full' : '' } ${variantClasses()} flex items-center` } onClick={props.onClick}>
      { props.loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : '' }
      <div className="flex-1"> { props.children } </div>
    </button>
  )
}

Button.defaultProps = defaultProps;

export default Button