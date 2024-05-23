"use client";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useState } from "react";

type Props = {
  className?: string;
  menu: Menu;
  idMenu?: number;
  handleDeleteMenu: () => void;
};

type Menu = {
  id: number;
  name: string;
  unit_id: number;
};

export default function DeleteLihatMenu(props: Props) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [modal, setModal] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const router = useRouter();

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleCheckboxChange = () => {
    setModal(!modal);
  };

  const handleDelete = async (e: SyntheticEvent) => {
    e.preventDefault(); // Prevent default action of the button click event
    setIsMutating(true);

    const res = await fetch(`${apiUrl}/simrs_menu/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: props.menu.id }),
    });
    setIsMutating(false);
    if (res.ok) {
      // Handle success, e.g., show a success message
      console.log("Menu deleted successfully");
      setModal(false); // Close the modal after successful submission
      props.handleDeleteMenu();
    } else {
      // Handle errors, e.g., show an error message
      console.error("Error deleting unit:", res.statusText);
    }
  };

  return (
    <div className={props.className}>
      <button className="btn" onClick={toggleModal}>
        Delete
      </button>
      <input
        type="checkbox"
        checked={modal}
        onChange={handleCheckboxChange}
        className="modal-toggle"
      />
      {modal && (
        <div className="modal text-white">
          <div className="modal-box">
            <h3 className="font-bold">Delete </h3>
            <p className="py-4">
              Are you sure you want to delete this {props.menu.name} ?
            </p>
            <div className="modal-action">
              {isMutating ? (
                <button className="btn loading">Deleting...</button>
              ) : (
                <>
                  <button className="btn" onClick={toggleModal}>
                    Close
                  </button>
                  <button
                    onClick={handleDelete}
                    className="btn pr-5 hover:bg-slate-200 hover:text-black"
                    type="button"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
