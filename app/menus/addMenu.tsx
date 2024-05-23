"use client";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import Dropdown from "../components/Dropdown";

type Props = {
  className?: string;
  menu?: Menu;
  unitId?: number | string;
  onMenuAdded?: () => void;
};

type Unit = {
  id: string;
  name: string;
};

type Menu = {
  id: number;
  name: string;
};

export default function AddMenu(props: Props) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [modal, setModal] = useState(false);
  const [menuName, setMenuName] = useState("");
  const [units, setUnits] = useState<Unit[]>([]);
  const [isMutating, setIsMutating] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await fetch(`${apiUrl}/simrs_unit/`);
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
  }, [apiUrl]);

  const closeModal = () => {
    setModal(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!menuName || !props.unitId) {
      setErrors({
        menuName: !menuName ? "Menu Name is required" : "",
        unitId: !props.unitId ? "Unit Name is required" : "",
      });
      return;
    }

    setIsMutating(true);

    const res = await fetch(`${apiUrl}/simrs_menu/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: menuName, unit_id: props.unitId }),
    });
    setIsMutating(false);
    if (res.ok) {
      console.log("Menu added successfully");
      setModal(false);
      if (props.onMenuAdded) {
        props.onMenuAdded();
      }
    } else {
      console.error("Error adding menu:", res.statusText);
    }
  };

  return (
    <div className={props.className}>
      <button className="btn" onClick={() => setModal(true)}>
        Add Menu
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
                <h2 className="text-2xl font-bold mb-4">Add New Menu</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-control">
                    <label htmlFor="unit" className="label hidden">
                      Unit Name
                    </label>
                    {props.unitId ? (
                      <input
                        id="unitId"
                        type="text"
                        value={props.unitId.toString()}
                        className="input hidden"
                        disabled
                      />
                    ) : (
                      <Dropdown
                        options={units.map((unit) => ({
                          id: unit.id,
                          name: unit.name,
                        }))}
                        value={props.unitId ? props.unitId.toString() : ""}
                        onChange={(value) => {
                          setErrors({ ...errors, unitId: "" });
                        }}
                      />
                    )}

                    {errors.unitId && (
                      <p className="text-red-500">{errors.unitId}</p>
                    )}
                  </div>
                  <div className="form-control">
                    <label htmlFor="menuName" className="label">
                      Menu Name
                    </label>
                    <input
                      id="menuName"
                      type="text"
                      value={menuName}
                      onChange={(e) => setMenuName(e.target.value)}
                      className="input"
                    />
                    {errors.menuName && (
                      <p className="text-red-500">{errors.menuName}</p>
                    )}
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
