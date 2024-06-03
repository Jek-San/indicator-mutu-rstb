import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { toast } from "sonner";

type Props = {
  className?: string;
  menuId?: number | string;
  onIndicatorAdded: () => void;
};

export default function AddIndicator(props: Props) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [modal, setModal] = useState(false);
  const [indicatorName, setIndicatorName] = useState("");
  const [menu_id, setMenuId] = useState(props.menuId ? props.menuId : "");
  const [isMutating, setIsMutating] = useState(false);

  const closeModal = () => {
    setModal(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsMutating(true);
    console.log(menu_id, indicatorName);

    try {
      const res = await fetch(`${apiUrl}/simrs_indicator/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: indicatorName, menu_id: menu_id }),
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
    <div className="">
      <button className="btn text-white" onClick={() => setModal(true)}>
        Add Indicator
      </button>

      <Transition appear show={modal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-y-auto"
          onClose={closeModal}
        >
          {/* Overlay */}
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
                  <div className="form-control">
                    <label
                      htmlFor="indicatorName"
                      className="label text-white font-sans"
                    >
                      Indicator Name
                    </label>
                    <input
                      required
                      id="indicatorName"
                      type="text"
                      value={indicatorName}
                      onChange={(e) => setIndicatorName(e.target.value)}
                      className="input bg-white text-black text-2xl"
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
