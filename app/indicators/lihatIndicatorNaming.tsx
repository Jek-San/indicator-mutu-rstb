"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import AddLihatIndicatorNaming from "./addLihatIndicatorNaming";

type Props = {
  indicator: Indicator;
};
type Indicator = {
  id: number;
  name: string;
  menu_id: number;
};

type IndicatorNaming = {
  id: number;
  indicator_id: number;
  n_name: string;
  d_name: string;
};

export default function LihatIndicatorNaming(props: Props) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [isOpen, setIsOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [dataIndicatorNaming, setDataIndicatorNaming] =
    useState<IndicatorNaming | null>(null);
  const [n_naming, setN_naming] = useState<string>("");
  const [d_naming, setD_naming] = useState<string>("");
  const [id, setId] = useState<number>(0);
  const [indicatorId, setIndicatorId] = useState<number>(props.indicator.id);

  async function getIndicatorNamingByIndicatorId(indicatorId: number) {
    const res = await fetch(
      `${apiUrl}/simrs_naming/?indicator_id=` + indicatorId,
      {
        cache: "no-store",
      }
    );
    return res.json();
  }

  const handleEditIndicatorNaming = async () => {
    const res = await fetch(`${apiUrl}/simrs_naming/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        indicator_id: indicatorId,
        n_name: n_naming,
        d_name: d_naming,
      }),
    });
    if (res.ok) {
      // Handle success, e.g., show a success message
      console.log("Indicator naming updated successfully");
      closeModal();
      return res.json();
    } else {
      // Handle errors, e.g., show an error message
      console.error("Error updating indicator naming:", res.statusText);
    }
  };

  const handleCreateIndicatorNaming = async () => {
    const res = await fetch(`${apiUrl}/simrs_naming/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        indicator_id: indicatorId,
        n_name: n_naming,
        d_name: d_naming,
      }),
    });
    if (res.ok) {
      // Handle success, e.g., show a success message
      console.log("Indicator naming Created successfully");
      closeModal();
      return res.json();
    } else {
      // Handle errors, e.g., show an error message
      console.error("Error updating indicator naming:", res.statusText);
    }
  };

  function closeModal() {
    setIsChanged(false);
    setIsDirty(false);
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  useEffect(() => {
    getIndicatorNamingByIndicatorId(props.indicator.id)
      .then((data) => {
        setDataIndicatorNaming(data[0]);
        if (dataIndicatorNaming) {
          setId(dataIndicatorNaming.id);
          setN_naming(dataIndicatorNaming.n_name || ""); // Fallback to empty string if data is falsy
          setD_naming(dataIndicatorNaming.d_name || ""); // Fallback to empty string if data is falsy
        }
      })
      .catch((error) => {
        console.error("Error fetching indicator naming:", error);
      });
  }, [isOpen, props.indicator.id]);

  return (
    <>
      <button className="btn text-white" type="button" onClick={openModal}>
        Lihat Nama Indicator
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 mt-5 overflow-y-auto "
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

          <div className="flex min-h-screen items-center justify-center p-4 text-center ">
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
                {/* BUTTON */}
                <AddLihatIndicatorNaming indicator={props.indicator} />
                {/* BUTTON */}
                <div className="mt-2 overflow-y-auto max-h-[50vh]">
                  <table className="table-auto w-full">
                    <thead className="bg-slate-950 text-white font-bold text-xl sticky top-0 z-10">
                      <tr>
                        <th className="px-2 py-2 hidden">Id</th>
                        <th className="px-2 py-2 ">Type</th>
                        <th className="px-4 py-2">Indicator Name</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-black">
                      {dataIndicatorNaming ? (
                        <>
                          <tr>
                            <td className="px-2 py-2 text-center">N</td>
                            <td className="px-4 py-2">
                              <textarea
                                className="w-full px-2 py-1 bg-white text-black"
                                value={n_naming}
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  setN_naming(newValue);
                                  if (
                                    n_naming === dataIndicatorNaming.n_name &&
                                    d_naming === dataIndicatorNaming.d_name
                                  ) {
                                    setIsDirty(false);
                                  } else {
                                    setIsDirty(true);
                                  }
                                }}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 py-2 text-center">D</td>
                            <td className="px-4 py-2">
                              <textarea
                                className="w-full px-2 py-1 bg-white text-black"
                                value={d_naming}
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  setD_naming(newValue);
                                  if (
                                    n_naming === dataIndicatorNaming.n_name &&
                                    newValue === dataIndicatorNaming.d_name
                                  ) {
                                    setIsDirty(false);
                                  } else {
                                    setIsDirty(true);
                                  }
                                }}
                              />
                            </td>
                          </tr>
                        </>
                      ) : (
                        <>
                          <tr>
                            <td className="px-2 py-2 text-center">N</td>
                            <td className="px-4 py-2">
                              <textarea
                                required
                                className="w-full px-2 py-1 bg-white text-black"
                                value={n_naming}
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  setN_naming(newValue);
                                  if (n_naming === "" || d_naming === "") {
                                    setIsChanged(false);
                                  } else {
                                    setIsChanged(true);
                                  }
                                }}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 py-2 text-center">D</td>
                            <td className="px-4 py-2">
                              <textarea
                                required
                                className="w-full px-2 py-1 bg-white text-black"
                                value={d_naming}
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  setD_naming(newValue);
                                  if (n_naming === "" || d_naming === "") {
                                    setIsChanged(false);
                                  } else {
                                    setIsChanged(true);
                                  }
                                }}
                              />
                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex justify-between">
                  <button
                    type="button"
                    className="justify-center rounded-md border border-transparent bg-blue-100 px-2 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                  <div className="flex">
                    <button
                      type="button"
                      className={`${
                        dataIndicatorNaming ? "hidden" : ""
                      } btn inline-flex justify-center rounded-md border border-transparent bg-blue-200 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
                      onClick={handleCreateIndicatorNaming}
                      disabled={!isChanged}
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      className={`${
                        isDirty ? "" : "hidden"
                      } btn inline-flex justify-center rounded-md border border-transparent bg-blue-200 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
                      onClick={handleEditIndicatorNaming}
                      disabled={!isDirty}
                    >
                      Save Edit
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
