"use client";
import React, { useState, useEffect } from "react";
import SelectUnit from "./selectUnit";
import SelectMenu from "./selectMenu";
import DataTable from "./dataTable";
import SelectMonth from "./selectMonth";

interface Props {}

interface Unit {
  id: number;
  name: string;
}

interface Menu {
  id: number;
  name: string;
  unit_id: number;
}

interface IndicatorValue {
  date: string;
  value: number;
}

interface DataTableProps {
  id_indicator: number;
  name: string;
  values: {
    N: {
      n_name: string;
      data: IndicatorValue[];
      sumN: number;
    };
    D: {
      d_name: string;
      data: IndicatorValue[];
      sumD: number;
    };
    percentageRatio: number;
  };
}

const getCurrentYear = () => {
  const currentDate = new Date();
  return currentDate.getFullYear();
};

const MonthlyData: React.FC<Props> = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [dataTable, setDataTable] = useState<DataTableProps[]>([]);
  const [dataUnit, setDataUnit] = useState<Unit[]>([]);
  const [unitId, setUnitId] = useState<number | null>(null);
  const [dataMenu, setDataMenu] = useState<Menu[]>([]);
  const [menuId, setMenuId] = useState<number | null>(null);
  const [month, setMonth] = useState<string>(new Date().getMonth().toString());
  const [year, setYear] = useState<number>(getCurrentYear());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const unitResponse = await fetch(`${apiUrl}/simrs_unit/`, {
          cache: "no-store",
        });
        if (!unitResponse.ok) {
          throw new Error("Failed to fetch unit data");
        }
        const unitData = await unitResponse.json();
        setDataUnit(unitData);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchMenuData = async () => {
      if (unitId !== null) {
        try {
          setLoading(true);
          const menuResponse = await fetch(
            `${apiUrl}/simrs_menu/getmenubyunitid.php?unit_id=${unitId}`,
            {
              cache: "no-store",
            }
          );
          if (!menuResponse.ok) {
            throw new Error("Failed to fetch menu data");
          }
          const menuData = await menuResponse.json();
          setDataMenu(menuData);
        } catch (error: any) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMenuData();
  }, [unitId]);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      const dataTableResponse = await fetch(
        `${apiUrl}/simrs_indicator_values/?menu_id=${menuId}&year=${year}&month_index=${month}`,
        {
          cache: "no-store",
        }
      );
      if (!dataTableResponse.ok) {
        throw new Error("Failed to fetch data table");
      }
      const dataResult = await dataTableResponse.json();
      setDataTable(dataResult);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-4 px-10 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Monthly Data</h1>
      {loading && <p className="text-gray-700">Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <div className="flex items-start gap-4 mb-6">
        <div className="flex flex-col">
          <label htmlFor="unit" className="font-semibold text-gray-700 mb-2">
            Unit:
          </label>
          <SelectUnit
            options={dataUnit}
            value={null}
            onChange={(value) => {
              setUnitId(value.id);
              setMenuId(null);
            }}
          />
        </div>
        {unitId !== null && (
          <div className="flex flex-col">
            <label htmlFor="menu" className="font-semibold text-gray-700 mb-2">
              Menu:
            </label>
            <SelectMenu
              options={dataMenu}
              value={null}
              onChange={(value) => {
                setMenuId(value.id);
              }}
            />
          </div>
        )}
        {menuId !== null && (
          <div className="flex flex-col">
            <label htmlFor="menu" className="font-semibold text-gray-700 mb-2">
              Month:
            </label>
            <SelectMonth
              value={month}
              onChange={(value) => {
                setMonth(value);
                setDataTable([]);
              }}
            />
          </div>
        )}
        <div className="flex" style={{ marginTop: "auto" }}>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={unitId === null || menuId === null}
            onClick={handleSubmit}
          >
            Lihat Data Bulanan
          </button>
        </div>
      </div>
      {dataTable.length > 0 && (
        <DataTable data={dataTable} month={parseInt(month)} year={year} />
      )}
    </div>
  );
};

export default MonthlyData;
