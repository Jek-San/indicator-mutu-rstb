"use client";
import React, { useState, useEffect, useRef, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import nookies from "nookies";

type Option = {
  id: number;
  name: string;
  unit_id: number;
};

type SelectMenuProps = {
  options: Option[] | [];
  value: Option | null | undefined;
  onChange: (value: Option) => void;
};

const SelectMenu: React.FC<SelectMenuProps> = ({
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
    setSearchTerm("");
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
    <div className="relative ">
      <input
        type="text"
        placeholder="---PILIH MENU---"
        className="input w-full input-bordered cursor-pointer bg-black text-white rounded-md py-2 px-3"
        value={searchTerm ? searchTerm : ""}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onClick={toggleDropdown}
        ref={inputRef}
        required
      />
      {isOpen && (
        <ul className="dropdown-menu absolute z-10 w-full bg-gray-800 rounded-md shadow-lg">
          {filteredOptions.length === 0 ? (
            <li className="bg-white text-white py-2 pl-2 mt-2">
              No data available
            </li>
          ) : (
            filteredOptions.map((option) => (
              <li
                key={option.id}
                onClick={() => handleOptionClick(option)}
                onKeyDown={(e) => handleOptionKeyDown(e, option)}
                className="dropdown-item cursor-pointer text-white py-2 hover:bg-gray-700 pl-2 mt-2"
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

export default SelectMenu;
