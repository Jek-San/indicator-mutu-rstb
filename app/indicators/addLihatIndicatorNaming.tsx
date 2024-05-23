"use client";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import ListBox from "../components/ListBox";
import { useRouter } from "next/navigation";

type Props = {
  className?: string;
  menu?: Menu;
  unitId?: number | string;
  onIndicatorAdded?: () => void;
  indicator: Indicator;
};
type Indicator = {
  id: number;
  name: string;
  menu_id: number;
};

type Unit = {
  id: string;
  name: string;
};

type Menu = {
  id: string;
  name: string;
};

export default function AddLihatIndicatorNaming(props: Props) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [modal, setModal] = useState(false);
  const [menuName, setMenuName] = useState("");
  const [unitId, setUnitId] = useState("");
  const [units, setUnits] = useState<Unit[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [menuId, setMenuId] = useState("");
  const [indicatorName, setIndicatorName] = useState("");
  const [indicatorId, setIndicatorId] = useState(props.indicator.id);
  const [nName, setNname] = useState("");
  const [dName, setDname] = useState("");
  const [isMutating, setIsMutating] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const router = useRouter();

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/simrs_unit/`);
        if (!response.ok) {
          throw new Error("Failed to fetch units");
        }
        const data = await response.json();
        setUnits(data);
      } catch (error) {
        console.error("Error fetching units:", error);
      }
    };

    fetchUnits();
  }, []);

  useEffect(() => {
    if (unitId !== "") {
      fetchMenusByUnitId(unitId);
      setMenuId(""); // Reset menuId when unitId changes
      setMenuName("");
      setErrors({ ...errors, unitId: "" });
    }
  }, [unitId]);

  const fetchMenusByUnitId = async (unitId: string) => {
    try {
      const response = await fetch(
        `${apiUrl}/simrs_menu/getmenubyunitid.php?unit_id=${parseInt(unitId)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch menus");
      }
      const data = await response.json();
      setMenus(data);
    } catch (error) {
      console.error("Error fetching menus:", error);
    }
  };

  const closeModal = () => {
    setModal(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    console.log(props.indicator.id, nName, dName);
    setIsMutating(true);

    const res = await fetch(`${apiUrl}/simrs_naming/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        indicator_id: props.indicator.id,
        n_name: nName,
        d_name: dName,
      }),
    });
    setIsMutating(false);
    if (res.ok) {
      console.log("N Name and D Name added successfully");
      setDname("");
      setNname("");
      setModal(false);
      if (props.onIndicatorAdded) {
        props.onIndicatorAdded();
      }
      router.refresh();
    } else {
      console.error("Error adding menu:", res.statusText);
    }
  };

  return (
    <div className={props.className}>
      <button className="btn" onClick={() => setModal(true)}>
        Add Nama Indicator
      </button>

      <Transition appear show={modal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full bg-slate-800 max-w-md p-6 rounded shadow-xl">
                <h2 className="text-2xl font-bold mb-4">
                  Add New Nama Indicator
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-control">
                    <label htmlFor="unitId" className="label">
                      Unit
                    </label>
                    <input
                      id="indicator_id"
                      type="number"
                      value={props.indicator.id}
                      className="input hidden"
                      required
                      onChange={(e) => setIndicatorId(parseInt(e.target.value))}
                    />
                  </div>

                  <div className="form-control">
                    <label htmlFor="nName" className="label">
                      N Name
                    </label>
                    <input
                      required
                      id="n_name"
                      type="text"
                      value={nName}
                      onChange={(e) => setNname(e.target.value)}
                      className="input"
                    />
                  </div>
                  <div className="form-control">
                    <label htmlFor="dName" className="label">
                      D Name
                    </label>
                    <input
                      required
                      id="d_name"
                      type="text"
                      value={dName}
                      onChange={(e) => setDname(e.target.value)}
                      className="input"
                    />
                  </div>
                  <div className="flex justify-between mt-6">
                    <button
                      type="button"
                      className="btn bg-red-600 text-white"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isMutating}
                    >
                      {isMutating ? "Creating..." : "Create"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
