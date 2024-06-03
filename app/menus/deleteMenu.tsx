"use client";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useState } from "react";
import { toast } from "sonner";

type Props = {
  className?: string;
  menu: Menu;
  idMenu?: number;
};
type Menu = {
  id: number;
  name: string;
};

export default function DeleteMenu({ className, menu, idMenu }: Props) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [modal, setModal] = useState(false);
  const [menuId, setMenuId] = useState<number | string>(
    idMenu ? idMenu : menu.id
  );
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

    try {
      const res = await fetch(`${apiUrl}/simrs_menu/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: menuId }),
      });

      const responseBody = await res.json();
      console.log("Response:", res);
      console.log("Response body:", responseBody);

      if (res.ok) {
        toast.success("Menu deleted successfully");
        setModal(false); // Close the modal after successful submission
        router.refresh();
      } else if (res.status === 500) {
        toast.error("Internal Server Error: " + responseBody.message);
      } else {
        toast.error("Error deleting menu: " + responseBody.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Error deleting menu: " + error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <div className={`${className} `}>
      <button className="btn text-white" onClick={toggleModal}>
        Delete
      </button>
      <input
        type="checkbox"
        checked={modal}
        onChange={handleCheckboxChange}
        className="modal-toggle"
      />
      {modal && (
        <div className="modal ">
          <div className="modal-box">
            <h3 className="font-bold text-white tracking-widest">Delete </h3>
            <p className="py-4 text-slate-300">
              Are you sure you want to delete this {menu.name} ?
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
                    className="btn pr-5 hover:bg-red-500 hover:text-black"
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
