"use client";
import { useRouter } from "next/navigation";

import { useState } from "react";

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
    setIsMutating(false);
    if (res.ok) {
      // Handle success, e.g., show a success message
      console.log("Menu added successfully");
      setMenuName(""); // Clear the input field after successful submission
      setModal(false); // Close the modal after successful submission
      router.refresh();
    } else {
      // Handle errors, e.g., show an error message
      console.error("Error adding menu:", res.statusText);
    }
  };

  return (
    <div className={props.className}>
      <button className="btn" onClick={toggleModal}>
        Update
      </button>
      <input
        type="checkbox"
        checked={modal}
        onChange={handleCheckboxChange}
        className="modal-toggle"
      />
      {modal && (
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold mb-1 text-2xl ">Update Menu</h3>
            <form onSubmit={handleUpdate}>
              <div className="form-control hidden">
                <label htmlFor="" className="label font-bold text-xl">
                  Id
                </label>
                <input
                  type="number"
                  value={menuId}
                  onChange={(e) => setMenuId(parseInt(e.target.value))}
                  className="input w-full input-bordered"
                />
              </div>

              <div className="form-control">
                <label htmlFor="" className="label font-bold text-xl">
                  Menu Name
                </label>
                <input
                  type="text"
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                  className="input w-full input-bordered"
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
                    <button className="btn" onClick={toggleModal}>
                      Close
                    </button>
                    <button className="btn btn-primary" type="submit">
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
