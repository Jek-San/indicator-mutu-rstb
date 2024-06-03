"use client";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import AddMenu from "../menus/addMenu";
import DeleteMenu from "../menus/deleteMenu";
import DeleteLihatIndicator from "./deleteLihatIndicator";
import AddIndicator from "./addIndicator";
// import DeleteLihatMenu from "./deleteLihatMenu";

type Props = {
  menu: Menu;
};

type Unit = {
  id: number;
  name: string;
};

type Menu = {
  id: number;
  name: string;
};
type Indicator = {
  id: number;
  name: string;
  menu_id: number;
};

export default function LihatIndicator(props: Props) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  let [isOpen, setIsOpen] = useState(false); // Changed to initialize as closed
  const [dataIndicator, setDataIndicator] = useState<Indicator[]>([]);

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    if (isOpen) {
      console.log(props.menu.id);
      getIndicatroByMenuId(props.menu.id).then((data) => {
        setDataIndicator(data);
      });
      console.log(dataIndicator.length);
    }
  }, [isOpen]); // Removed dataMenu from dependency array

  function openModal() {
    setIsOpen(true);
  }

  async function getIndicatroByMenuId(menuId: number) {
    const res = await fetch(
      `${apiUrl}/simrs_menu/getindicatorbymenuid.php?menu_id=` + menuId,
      {
        cache: "no-store",
      }
    );

    return res.json();
  }

  const handleIndicatorAdded = () => {
    // Refresh dataMenu after a menu is added
    getIndicatroByMenuId(props.menu.id).then((data) => {
      setDataIndicator(data);
    });
  };
  const handleDeleteIndicator = () => {
    getIndicatroByMenuId(props.menu.id).then((data) => {
      setDataIndicator(data);
    });
  };

  return (
    <>
      <div className="">
        <button type="button" onClick={openModal} className="btn text-white">
          Lihat Indicator
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
                        <th className="px-2 py-2 ">No</th>
                        <th className="px-4 py-2">Inidicator Name</th>
                        <th className="px-4 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-black">
                      {dataIndicator.length == 0 ? (
                        <tr>
                          <td
                            colSpan={3}
                            className="px-4 py-2 text-center text-black"
                          >
                            There is no data.
                          </td>
                        </tr>
                      ) : (
                        dataIndicator.map((indicator, i) => (
                          <tr key={indicator.id}>
                            <td className="px-2 py-2  hidden">
                              {indicator.id}
                            </td>
                            <td className="px-2 py-2 text-center ">{i + 1}</td>
                            <td className="px-4 py-2 ">{indicator.name}</td>
                            <td className="px-4 py-2 flex gap-2 items-center text-left">
                              {/* Action buttons */}
                              <DeleteLihatIndicator
                                indicator={indicator}
                                handleDeleteIndicator={handleDeleteIndicator}
                              />
                              {/* <DeleteLihatMenu
            menu={menu}
            handleDeleteMenu={handleDeleteMenu}
          /> */}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex justify-between">
                  <button
                    type="button"
                    className="btn bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                  <AddIndicator
                    menuId={props.menu.id}
                    onIndicatorAdded={handleIndicatorAdded}
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
