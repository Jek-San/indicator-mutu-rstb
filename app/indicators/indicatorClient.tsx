"use client";
import React, { useState, useEffect } from "react";
import SelectUnit from "./selectUnit";
import SelectMenu from "./selectMenu";
import AddIndicator from "./addIndicator";
import LihatIndicatorNaming from "./lihatIndicatorNaming";
import nookies from "nookies";
import DeleteIndicator from "./deleteIndicator";
import UpdateIndicator from "./updateIndicator";
import { toast } from "sonner";

type Unit = {
  id: number;
  name: string;
};

type Menu = {
  id: number;
  name: string;
  unit_id: number;
};

type Indicator = {
  id: number;
  name: string;
  menu_id: number;
  unit_name?: string;
};

const IndicatorsClient: React.FC = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [units, setUnits] = useState<Unit[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [unitId, setUnitId] = useState<number | null>(null);
  const [menuId, setMenuId] = useState<number | null>(null);
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [loadingUnits, setLoadingUnits] = useState<boolean>(false);
  const [loadingMenus, setLoadingMenus] = useState<boolean>(false);

  useEffect(() => {
    const cookies = nookies.get(null);
    const unitId = parseInt(cookies.unit_id, 10);
    if (!isNaN(unitId) && unitId > 0) {
      setUnitId(unitId);
    }
  }, []);

  useEffect(() => {
    async function fetchUnits() {
      setLoadingUnits(true);
      try {
        const fetchedUnits = await fetch(`${apiUrl}/simrs_unit/`, {
          cache: "no-store",
        }).then((res) => res.json());
        setUnits(fetchedUnits);
      } catch (error) {
        toast.error("Error fetching units:" + error);
        console.error("Error fetching units:", error);
      } finally {
        setLoadingUnits(false);
      }
    }
    fetchUnits();
  }, [apiUrl]);

  useEffect(() => {
    async function fetchMenus() {
      if (unitId !== null) {
        setLoadingMenus(true);
        try {
          const fetchedMenus = await fetch(
            `${apiUrl}/simrs_menu/getmenubyunitid.php?unit_id=${unitId}`,
            {
              cache: "no-store",
            }
          ).then((res) => res.json());
          setMenus(fetchedMenus);
        } catch (error) {
          console.error("Error fetching menus:", error);
        } finally {
          setLoadingMenus(false);
        }
      }
    }
    fetchMenus();
  }, [unitId, apiUrl]);

  const handleFetchIndicators = async () => {
    if (unitId !== null && menuId !== null) {
      try {
        const response = await fetch(
          `${apiUrl}/simrs_indicator/?unit_id=${unitId}&menu_id=${menuId}`,
          {
            cache: "no-store",
          }
        );
        if (response.ok) {
          const fetchedIndicators = await response.json();
          setIndicators(fetchedIndicators);
        } else if (response.status === 404) {
          setIndicators([]);
        } else {
          toast.error("Error fetching indicators:" + response.statusText);
          console.error("Error fetching indicators:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching indicators:", error);
      }
    }
  };
  const handleIndicatorAdded = () => {
    handleFetchIndicators();
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleFetchIndicators();
        }}
      >
        <div className="flex items-start gap-4 mb-1">
          <div className="hidden">
            <label htmlFor="unit">Unit:</label>
            {/* Uncomment this if you want to allow unit selection */}
            {/* <SelectUnit
              options={units}
              value={units.find(unit => unit.id === unitId) || null}
              onChange={(value) => {
                setUnitId(value.id);
                setMenuId(null);
              }}
            /> */}
          </div>
          {unitId !== null && (
            <div className="flex flex-col">
              <label htmlFor="menu">Menu:</label>
              <SelectMenu
                options={menus}
                value={menus.find((menu) => menu.id === menuId) || null}
                onChange={(value) => {
                  setMenuId(value.id);
                }}
                // disabled={loadingMenus}
              />
            </div>
          )}
          <div className="flex" style={{ marginTop: "auto" }}>
            <button
              type="submit"
              className="btn"
              disabled={unitId === null || menuId === null}
            >
              {loadingMenus ? "Loading..." : "Fetch Indicators"}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 p-1">
          <h1 className="text-3xl">Indicators</h1>
          <AddIndicator
            unitId={unitId || 0}
            onIndicatorAdded={handleIndicatorAdded}
          />
        </div>
      </form>
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead className="bg-gray-800 text-white font-bold text-xl">
            <tr>
              <th className="px-2 py-2 hidden">Id</th>
              <th className="px-4 py-2">No</th>
              <th className="px-4 py-2">Indicator Name</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-black">
            {indicators.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-2 text-center">
                  No data available
                </td>
              </tr>
            ) : (
              indicators.map((indicator, i) => (
                <tr key={indicator.id}>
                  <td className="px-2 py-2 text-center hidden">
                    {indicator.id}
                  </td>
                  <td className="px-4 py-2 text-center">{i + 1}</td>
                  <td className="px-4 py-2">{indicator.name}</td>
                  <td className="px-4 py-2 flex gap-2 items-center justify-center">
                    <LihatIndicatorNaming indicator={indicator} />
                    <DeleteIndicator
                      indicator={indicator}
                      handleDeleteIndicator={handleIndicatorAdded}
                    />
                    <UpdateIndicator
                      indicator={indicator}
                      onIndicatorAdded={handleIndicatorAdded}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IndicatorsClient;
