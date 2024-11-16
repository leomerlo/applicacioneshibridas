import React, { useState } from 'react';

interface DropdownItem {
    label: string;
    value: string;
}

interface DropdownProps {
    buttonLabel: string;
    items: DropdownItem[];
    onSelect: (value: string) => void;
}

const Dropdown = ({ buttonLabel, items, onSelect }: DropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (value: string) => {
        onSelect(value);
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block text-left">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center text-primary-main text-heading-sm font-medium bg-transparent hover:text-blue-800 focus:outline-none"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                {buttonLabel}
                <svg
                    className={`w-4 h-4 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-2 w-auto bg-white border border-gray-300 rounded-md shadow-lg" role="menu">
                    <ul className="py-1" role="menu">
                        {items.map((item) => (
                            <li key={item.value} role="none">
                                <button
                                    onClick={() => handleSelect(item.value)}
                                    className="block w-full px-6 py-4 text-left text-body-regular text-primary-main focus:outline-none"
                                    role="menuitem"
                                >
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Dropdown;