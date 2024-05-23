"use client";
import { useRouter } from "next/navigation";

import { useState } from "react";

type Props = {
  className?: string;
  unit: Unit;
};

type Unit = {
  id: number;
  name: string;
};

export default function UpdateUnit(props: Props) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [modal, setModal] = useState(false);
  const [id, setId] = useState<number>(props.unit.id);
  const [name, setName] = useState(props.unit.name);
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

    const res = await fetch(`${apiUrl}/simrs_unit/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        name: name,
      }),
    });
    setIsMutating(false);
    if (res.ok) {
      // Handle success, e.g., show a success message
      console.log("Unit added successfully");
      setName(""); // Clear the input field after successful submission
      setModal(false); // Close the modal after successful submission
      router.refresh();
    } else {
      // Handle errors, e.g., show an error message
      console.error("Error adding unit:", res.statusText);
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
            <h3 className="font-bold mb-1 text-2xl ">Update Unit</h3>
            <form onSubmit={handleUpdate}>
              <div className="form-control hidden">
                <label htmlFor="" className="label font-bold text-xl">
                  Id
                </label>
                <input
                  type="number"
                  value={id}
                  onChange={(e) => setId(parseInt(e.target.value))}
                  className="input w-full input-bordered"
                />
              </div>
              <div className="form-control">
                <label htmlFor="" className="label font-bold text-xl">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input w-full input-bordered"
                  placeholder="Unit Name"
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
