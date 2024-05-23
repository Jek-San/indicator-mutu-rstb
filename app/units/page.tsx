import AddUnit from "./addUnit";
import DeleteUnit from "./deleteUnit";
import LihatMenu from "./lihatMenu";
import UpdateUnit from "./updateUnit";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Oke Gas",
};
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
async function getUnits() {
  try {
    const res = await fetch(`${apiUrl} /simrs_unit/`, {
      cache: "no-store",
    });

    if (res.status === 404) {
      return []; // Return empty array if data not found
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching units:", error);
    return []; // Return empty array on error
  }
}

type Props = {};
type Unit = {
  id: number;
  name: string;
};

export default async function UnitList({}: Props) {
  const units: Unit[] = await getUnits();
  const hasData = units.length > 0;

  return (
    <div className="py-10 px-10">
      <div className="flex items-center justify-between gap-4 p-1">
        <h1 className="text-3xl">Unit</h1>
        <AddUnit />
      </div>
      <div className="overflow-x-auto">
        {hasData ? (
          <table className="table-auto min-w-96 w-full">
            <thead className="bg-gray-800 text-white font-bold text-xl">
              <tr>
                <th className="px-2 py-2 hidden">Id</th>
                <th className="px-4 py-2">Unit Name</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-black">
              {units.map((unit, id) => (
                <tr key={unit.id}>
                  <td className="px-2 py-2 text-center hidden">{unit.id}</td>
                  <td className="px-4 py-2 text-center">{unit.name}</td>
                  <td className="px-4 py-2 flex gap-2 items-center justify-center">
                    <UpdateUnit className="text-white" unit={unit} />
                    <DeleteUnit unit={unit} />
                    <LihatMenu unit={unit} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-xl text-center mt-4">No data available</p>
        )}
      </div>
    </div>
  );
}
