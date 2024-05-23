"use client";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import AddMenu from "../menus/addMenu";
import DeleteMenu from "../menus/deleteMenu";
import DeleteLihatMenu from "./deleteLihatMenu";

type Props = {
  unit: Unit;
};

type Unit = {
  id: number;
  name: string;
};

type Menu = {
  id: number;
  name: string;
  unit_id: number;
};

export default function LihatMenu(props: Props) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  let [isOpen, setIsOpen] = useState(false); // Changed to initialize as closed
  const [dataMenu, setDataMenu] = useState<Menu[]>([]);

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    getUnitbyId(props.unit.id).then((data) => {
      setDataMenu(data);
    });
  }, []); // Removed dataMenu from dependency array

  function openModal() {
    setIsOpen(true);
  }

  async function getUnitbyId(unitId: number) {
    const res = await fetch(
      `${apiUrl}/simrs_unit/getmenubyunit.php?unit_id=` + unitId,
      {
        cache: "no-store",
      }
    );

    return res.json();
  }

  const handleMenuAdded = () => {
    // Refresh dataMenu after a menu is added
    getUnitbyId(props.unit.id).then((data) => {
      setDataMenu(data);
    });
  };
  const handleDeleteMenu = () => {
    getUnitbyId(props.unit.id).then((data) => {
      setDataMenu(data);
    });
  };

  return (
    <>
      <div className="btn">
        <button type="button" onClick={openModal} className="">
          Lihat Menu
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 mt-5 overflow-y-auto"
          onClose={closeModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="flex min-h-screen items-center justify-center p-4 text-center b">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full bg-slate-800 max-w-md transform overflow-hidden rounded-2xl  p-6 text-left align-middle shadow-xl transition-all">
                <div className="mt-2 overflow-y-auto max-h-[50vh]">
                  <table className="table-auto w-full">
                    <thead className="bg-slate-950 text-white font-bold text-xl sticky top-0 z-10">
                      <tr>
                        <th className="px-2 py-2 hidden">Id</th>
                        <th className="px-4 py-2">Menu Name</th>
                        <th className="px-4 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-black">
                      {dataMenu.map((menu, id) => (
                        <tr key={menu.id}>
                          <td className="px-2 py-2  hidden">{menu.id}</td>
                          <td className="px-4 py-2 ">{menu.name}</td>
                          <td className="px-4 py-2 flex gap-2 items-center justify-center">
                            {/* Action buttons */}
                            <DeleteLihatMenu
                              menu={menu}
                              handleDeleteMenu={handleDeleteMenu}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    className="  rounded-md border border-transparent bg-blue-100 px-4  text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                  <AddMenu
                    unitId={props.unit.id}
                    onMenuAdded={handleMenuAdded}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
