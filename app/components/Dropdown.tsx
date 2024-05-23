// Dropdown.tsx
"use client"; // Dropdown.tsx
import React, { useState, useEffect, useRef } from "react";

type Option = {
  id: string;
  name: string;
};

type DropdownProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
};

const Dropdown: React.FC<DropdownProps> = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (optionId: string) => {
    onChange(optionId);
    setIsOpen(false);
    setSearchTerm(options.find((option) => option.id === optionId)?.name || "");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filteredOptions.length > 0) {
      handleOptionClick(filteredOptions[0].id);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleOptionKeyDown = (
    e: React.KeyboardEvent<HTMLLIElement>,
    optionId: string
  ) => {
    if (e.key === "Enter") {
      handleOptionClick(optionId);
    }
  };

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search..."
        className="input w-full input-bordered cursor-pointer bg-gray-800 text-white rounded-md py-2 px-3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        ref={inputRef}
      />
      {isOpen && (
        <ul className="dropdown-menu absolute z-10 w-full bg-gray-800 rounded-md shadow-lg">
          {filteredOptions.map((option) => (
            <li
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              onKeyDown={(e) => handleOptionKeyDown(e, option.id)}
              className="dropdown-item cursor-pointer text-white py-2 hover:bg-gray-700 pl-2 mt-2"
              tabIndex={0}
            >
              {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
