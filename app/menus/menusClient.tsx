"use client";
import React, { useEffect, useState } from "react";
import AddMenu from "./addMenu";
import DeleteMenu from "./deleteMenu";
import LihatIndicator from "./lihatIndicator";
import UpdateMenu from "./updateMenu";
import nookies from "nookies";

type Props = {};
type Menu = {
  id: number;
  name: string;
};

export default function MenusClient({}: Props) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [menus, setMenus] = useState<Menu[]>([]);
  const [unitId, setUnitId] = useState<number>(0);

  useEffect(() => {
    const cookies = nookies.get(null);
    const unitId = cookies.unit_id;
    if (unitId !== null) {
      setUnitId(parseInt(unitId));
    }
  }, []);

  useEffect(() => {
    async function fetchMenus() {
      if (unitId === 0) return; // Ensure we only fetch if unitId is set
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
      }
    }
    fetchMenus();
  }, [unitId]); // Add unitId as a dependency

  const handleMenuAdded = () => {
    async function fetchMenus() {
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
      }
    }
    fetchMenus();
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 p-1">
        <h1 className="text-3xl">Menu</h1>
        <AddMenu unitId={unitId} onMenuAdded={handleMenuAdded} />
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead className="bg-gray-800 text-white font-bold text-xl">
            <tr>
              <th className="px-2 py-2 hidden">Id</th>
              <th className="px-4 py-2">No</th>
              <th className="px-4 py-2">Menu Name</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-black">
            {menus.map((menu, i) => (
              <tr key={menu.id}>
                <td className="px-2 py-2 text-center hidden">{menu.id}</td>
                <td className="px-4 py-2 text-center">{i + 1}</td>
                <td className="px-4 py-2 text-center">{menu.name}</td>
                <td className="px-4 py-2 flex gap-2 items-center justify-center">
                  <UpdateMenu className="text-white" menu={menu} />
                  <DeleteMenu menu={menu} />
                  <LihatIndicator menu={menu} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
