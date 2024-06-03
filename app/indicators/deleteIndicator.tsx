"use client";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useState } from "react";
import { toast } from "sonner";

type Props = {
  className?: string;
  indicator: Indicator;
  idIndicator?: number;
  handleDeleteIndicator: () => void;
};

type Menu = {
  id: number;
  name: string;
  unit_id: number;
};
type Indicator = {
  id: number;
  name: string;
  menu_id: number;
  unit_name?: string;
};

export default function DeleteIndicator(props: Props) {
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

    try {
      const res = await fetch(`${apiUrl}/simrs_indicator/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: props.indicator.id }),
      });

      const responseBody = await res.json();
      console.log("Response:", res);
      console.log("Response body:", responseBody);

      if (res.ok) {
        toast.success("Indicator deleted successfully");
        console.log("Indicator deleted successfully");
        setModal(false); // Close the modal after successful submission
        props.handleDeleteIndicator();
      } else if (res.status === 500) {
        toast.error("Internal Server Error: " + responseBody.message);
      } else {
        toast.error("Error deleting indicator: " + responseBody.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Error deleting indicator: " + error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <div className={`${props.className}`}>
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
        <div className="modal text-black">
          <div className="modal-box">
            <h3 className="font-bold text-white">Delete </h3>
            <p className="py-4 text-white">
              Are you sure you want to delete this {props.indicator.name} ?
            </p>
            <div className="modal-action">
              {isMutating ? (
                <button className="btn loading">Deleting...</button>
              ) : (
                <>
                  <button
                    className="btn text-white bg-slate-600"
                    onClick={toggleModal}
                  >
                    Close
                  </button>
                  <button
                    onClick={handleDelete}
                    className="btn pr-5 text-white bg-slate-600 hover:bg-slate-200 hover:text-black"
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
