"use-client";
import React, { useState } from "react";

type SelectMonthProps = {
  value: string | null;
  onChange: (value: string) => void;
};

const SelectMonth: React.FC<SelectMonthProps> = ({ value, onChange }) => {
  const months = [
    { name: "January", index: 0 },
    { name: "February", index: 1 },
    { name: "March", index: 2 },
    { name: "April", index: 3 },
    { name: "May", index: 4 },
    { name: "June", index: 5 },
    { name: "July", index: 6 },
    { name: "August", index: 7 },
    { name: "September", index: 8 },
    { name: "October", index: 9 },
    { name: "November", index: 10 },
    { name: "December", index: 11 },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <select
      value={value === null ? "" : value}
      onChange={handleChange}
      className="p-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
    >
      <option value="" disabled hidden>
        ---Select Month---
      </option>
      {months.map((month) => (
        <option
          key={month.index}
          value={month.index}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring  focus:border-blue-300 hover:bg-gray-950"
        >
          {month.name}
        </option>
      ))}
    </select>
  );
};

export default SelectMonth;
