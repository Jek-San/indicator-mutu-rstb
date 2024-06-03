"use client";
import React, { useState, useEffect, useRef } from "react";

type Option = {
  id: number;
  name: string;
};

type SelectMenuProps = {
  options: Option[];
  value: Option | null;
  onChange: (value: Option) => void;
};

const SelectUnit: React.FC<SelectMenuProps> = ({
  options,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: Option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm(option.name);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filteredOptions.length > 0) {
      handleOptionClick(filteredOptions[0]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = options.filter((option) =>
      option.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredOptions(filtered);
    setIsOpen(true);
  };

  const handleOptionKeyDown = (
    e: React.KeyboardEvent<HTMLLIElement>,
    option: Option
  ) => {
    if (e.key === "Enter") {
      handleOptionClick(option);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="---PILIH UNIT---"
        className="w-full px-4 py-2 border bg-white text-black border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onClick={toggleDropdown}
        ref={inputRef}
        required
      />
      {isOpen && (
        <ul className="absolute z-10 w-full max-h-52 overflow-y-auto border bg-white text-black border-gray-300 rounded-lg shadow-lg mt-1">
          {filteredOptions.length === 0 ? (
            <li className="text-gray-800 bg-black py-2 px-4">
              No data available
            </li>
          ) : (
            filteredOptions.map((option) => (
              <li
                key={option.id}
                onClick={() => handleOptionClick(option)}
                onKeyDown={(e) => handleOptionKeyDown(e, option)}
                className="cursor-pointer text-black py-2 px-4 hover:bg-gray-100"
                tabIndex={0}
              >
                {option.name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default SelectUnit;
