import React from 'react'

type Props = {
  name: string;
  label: string;
  value: string;
  onInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  type?: string;
  error?: string[];
  selected?: boolean;
  disabled?: boolean;
  required?: boolean;
  srOnly?: boolean;
}

const Input = (props: Props) => {

  const labelClasses = () => {
    let classes = ["block","text-base","text-gray-700"]
    if (props.srOnly) {
      classes.push("sr-only")
    }
    return classes.join(" ")
  }

  return (
    <div className="mt-4">
      <label htmlFor={props.name} className={labelClasses()}>{props.label} { props.required ? <span className="text-red-500">*</span> : <></> }</label>
      <div className="mt-1">
        { props.type === 'textarea' ? 
          // @ts-ignore 
          <textarea
            disabled={props.disabled || false}
            required={props.required || false}
            className="shadow-sm py-3 px-4 border border-solid border-gray-300 background-grey-10 block w-full sm:text-sm rounded-md"
            { ...props } />
          :
          <input
            disabled={props.disabled || false}
            required={props.required || false}
            className="shadow-sm py-3 px-4 border border-solid border-gray-300 background-grey-10 block w-full sm:text-sm rounded-md"
            { ...props }
          />
        }
      </div>
      {
        props.error ? 
          <div className="mt-1">
            { props.error.map((e: string) => (
              <p key={e} className="text-red-500 text-xs italic">{e}</p>
            ))}
          </div>
          :
          null
      }
    </div>
  )
}

export default Input