"use client";
import React, { useEffect, useState } from "react";
import nookies from "nookies";

type Props = {};

export default function TextUnit({}: Props) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [unitName, setUnitName] = useState("");
  useEffect(() => {
    const cookies = nookies.get(null);
    const unitId = cookies.unit_id;
    if (unitId === "") return;
    const fetchData = async () => {
      try {
        const fetchedUnits = await fetch(
          `${apiUrl}/simrs_unit/?id=${parseInt(unitId)}`,
          {
            cache: "no-store",
          }
        ).then((res) => res.json());
        console.log(fetchedUnits);
        setUnitName(fetchedUnits[0].name);
      } catch (error) {
        console.error("Error fetching units:", error);
      }
    };
    if (unitId !== null) {
      fetchData();
      console.log(unitName);
    }
  }, []);

  return (
    <span className="text-2xl font-extrabold text-gray-300 uppercase tracking-wider">
      {unitName}
    </span>
  );
}
