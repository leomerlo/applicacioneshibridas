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
  disabled: boolean;
  size?: 'small' | 'medium' | 'large';
}

const defaultProps: ButtonProps = {
  type: ButtonType.button,
  loading: false,
  disabled: false
}

const Button = (props: PropsWithChildren<ButtonProps>) => {
  const variantClasses = (): String => {

    let classes = "";

    switch(props.variant) {
      case 'primary':
      default:
        classes = 'bg-primary-main focus:bg-primary-focus hover:bg-primary-hover active:bg-primary-pressed text-white shadow-md';
        break;
      case 'secondary':
        classes = 'bg-primary-secondary focus:bg-secondary-focus hover:bg-secondary-hover active:bg-secondary-pressed text-primary-main';
        break;
      case 'tertiary':
        classes = 'bg-tertiary-main focus:bg-tertiary-focus hover:bg-tertiary-hover active:bg-tertiary-pressed text-white shadow-md';
        break;
    }

    switch (props.size) {
      case 'small':
        classes += ' py-2 px-2 text-sm';
        break;
      case 'large':
        classes += ' py-6 px-6 text-lg';
        break;
      case 'medium':
      default:
        classes += ' py-4 px-4 text-base';
        break;
    }

    return classes;
  }

  return (
    <button type={props.type} disabled={props.loading} className={ `${props.className || ''} rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 focus:text-black ${props.full ? 'w-full' : '' } ${props.disabled ? 'disabled' : variantClasses()} flex items-center` } onClick={props.onClick}>
      { props.loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : '' }
      <div className="flex-1"> { props.children } </div>
    </button>
  )
}

Button.defaultProps = defaultProps;

export default Button