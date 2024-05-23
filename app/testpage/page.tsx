"use-client";
import React from "react";

type Props = {};

export default function Page({}: Props) {
  return (
    <>
      <thead className="text-black">
        <tr>
          <th rowSpan={2} className="border bg-red text-center px-4 py-2">
            No
          </th>
          <th rowSpan={2} className="border px-4 py-2">
            Nama Indikator
          </th>
          <th colSpan={31} className="border px-4 py-2">
            Pemantauan Harian*)
          </th>
          <th className="border px-4 py-2">JML</th>
          <th className="border px-4 py-2">%</th>
        </tr>
        <tr>
          {Array.from({ length: 30 }, (_, index) => (
            <th key={index + 1} className="border px-4 py-2">
              {index + 1}
            </th>
          ))}
          <th className="border px-4 py-2">31</th>
        </tr>
      </thead>
    </>
  );
}
