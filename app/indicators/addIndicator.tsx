"use client";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import ListBox from "../components/ListBox";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  className?: string;
  unitId: number;
  onIndicatorAdded?: () => void;
};

type Menu = {
  id: string;
  name: string;
};

export default function AddIndicator(props: Props) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [modal, setModal] = useState(false);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [menuId, setMenuId] = useState("");
  const [indicatorName, setIndicatorName] = useState("");
  const [isMutating, setIsMutating] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (props.unitId > 0) {
      fetchMenusByUnitId(props.unitId.toString());
    }
  }, [props.unitId]);

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
    setIsMutating(true);

    try {
      const res = await fetch(`${apiUrl}/simrs_indicator/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: indicatorName, menu_id: menuId }),
      });

      const responseBody = await res.json();
      console.log("Response:", res);
      console.log("Response body:", responseBody);

      if (res.ok) {
        toast.success("Indicator added successfully");
        setIndicatorName("");
        setModal(false);
        if (props.onIndicatorAdded) {
          props.onIndicatorAdded();
        }
        router.refresh();
      } else if (res.status === 500) {
        toast.error("Internal Server Error: " + responseBody.message);
      } else {
        toast.error("Error adding indicator: " + responseBody.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Error adding indicator: " + error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <div className={props.className}>
      <button className="btn text-white" onClick={() => setModal(true)}>
        Add Indicator
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
                <h2 className="text-2xl font-bold mb-4 text-white">
                  Add New Indicator
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-control hidden">
                    <label htmlFor="unitId" className="label text-white hidden">
                      Unit
                    </label>
                    <input
                      id="unitId"
                      type="text"
                      value={props.unitId}
                      className="input hidden bg-white text-black"
                      readOnly
                    />
                  </div>

                  <div className="form-control">
                    <label
                      htmlFor="menuId"
                      className="label text-white text-xl"
                    >
                      Menu
                    </label>
                    {menus.length > 0 ? (
                      <ListBox
                        options={menus}
                        value={{
                          id: menuId,
                          name:
                            menus.find((menu) => menu.id === menuId)?.name ||
                            "",
                        }}
                        onChange={(value) => setMenuId(value.id)}
                      />
                    ) : (
                      <div>No Menu Available</div>
                    )}
                  </div>
                  <div className="form-control">
                    <label
                      htmlFor="indicatorName"
                      className="label text-white text-xl"
                    >
                      Indicator Name
                    </label>
                    <input
                      required
                      id="indicatorName"
                      type="text"
                      value={indicatorName}
                      onChange={(e) => setIndicatorName(e.target.value)}
                      className="input bg-white text-black"
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
