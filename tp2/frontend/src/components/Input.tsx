import React from 'react'

type Props = {
  name: string;
  label: string;
  value: string;
  onInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  selected?: boolean;
}

const Input = (props: Props) => {
  return (
    <div className="mt-4">
      <label htmlFor={props.name} className="block text-base text-gray-700">{props.label}</label>
      <div className="mt-1">
        { props.type === 'textarea' ? 
          <textarea
            className="shadow-sm py-3 px-4 border border-solid border-gray-300 background-grey-10 block w-full sm:text-sm rounded-md"
            { ...props } />
          :
          <input
            className="shadow-sm py-3 px-4 border border-solid border-gray-300 background-grey-10 block w-full sm:text-sm rounded-md"
            { ...props }
          />
        }
      </div>
      {
        props.error ? 
          <div className="mt-1">
            <p className="text-red-500 text-xs italic">{props.error}</p>
          </div>
          :
          null
      }
    </div>
  )
}

export default Input