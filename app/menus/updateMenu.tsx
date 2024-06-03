"use client";
import { useRouter } from "next/navigation";

import { useState } from "react";
import { toast } from "sonner";

type Props = {
  className?: string;
  menu: Menu;
};

type Menu = {
  id: number;
  name: string;
};

export default function UpdateMenu(props: Props) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [modal, setModal] = useState(false);
  const [menuId, setMenuId] = useState<number>(props.menu.id);

  const [menuName, setMenuName] = useState<string>(props.menu.name);

  const [isMutating, setIsMutating] = useState(false);
  const router = useRouter();

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleCheckboxChange = () => {
    setModal(!modal);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsMutating(true);

    try {
      const res = await fetch(`${apiUrl}/simrs_menu/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: menuId,
          name: menuName,
        }),
      });

      const responseBody = await res.json();
      console.log("Response:", res);
      console.log("Response body:", responseBody);

      if (res.ok) {
        toast.success("Menu updated successfully");
        setMenuName(""); // Clear the input field after successful submission
        setModal(false); // Close the modal after successful submission
        router.refresh();
      } else if (res.status === 500) {
        toast.error("Internal Server Error: " + responseBody.message);
      } else {
        toast.error("Error updating menu: " + responseBody.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Error updating menu: " + error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <div className={props.className}>
      <button className="btn text-white" onClick={toggleModal}>
        Update
      </button>
      <input
        type="checkbox"
        checked={modal}
        onChange={handleCheckboxChange}
        className="modal-toggle"
      />
      {modal && (
        <div className="modal text-black">
          <div className="modal-box">
            <h3 className="font-bold mb-1 text-2xl text-white ">Update Menu</h3>
            <form onSubmit={handleUpdate}>
              <div className="form-control hidden">
                <label
                  htmlFor=""
                  className="label text-gray-300 font-bold text-xl"
                >
                  Id
                </label>
                <input
                  type="number"
                  value={menuId}
                  onChange={(e) => setMenuId(parseInt(e.target.value))}
                  className="input w-full bg-black text-gray-300 input-bordered"
                />
              </div>

              <div className="form-control">
                <label
                  htmlFor=""
                  className="label text-gray-300 font-bold text-xl"
                >
                  Menu Name
                </label>
                <input
                  type="text"
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                  className="input text-gray-300 w-full input-bordered"
                  placeholder="Perawat"
                />
              </div>
              <div className="modal-action">
                {isMutating ? (
                  <button className="btn loading overflow-hidden">
                    Saving...
                  </button>
                ) : (
                  <>
                    <button className="btn  text-white" onClick={toggleModal}>
                      Close
                    </button>
                    <button
                      className="btn bg-blue-500 hover:bg-blue-800 text-white"
                      type="submit"
                    >
                      Save
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
