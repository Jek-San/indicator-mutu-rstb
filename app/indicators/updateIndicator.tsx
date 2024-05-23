"use client";
import { useRouter } from "next/navigation";

import { useState } from "react";

type Props = {
  className?: string;
  indicator: Indicator;
};

type Indicator = {
  id: number;
  name: string;
};

export default function UpdateIndicator(props: Props) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [modal, setModal] = useState(false);
  const [indicatorId, setIndicatorId] = useState<number>(props.indicator.id);

  const [indicatorName, setIndicatorName] = useState<string>(
    props.indicator.name
  );

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

    const res = await fetch(`${apiUrl}/simrs_indicator/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: indicatorId,
        name: indicatorName,
      }),
    });
    setIsMutating(false);
    if (res.ok) {
      // Handle success, e.g., show a success message
      console.log("Menu added successfully");
      setIndicatorName(""); // Clear the input field after successful submission
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
        <div className="modal text-white">
          <div className="modal-box">
            <h3 className="font-bold mb-1 text-2xl ">Update Indicator</h3>
            <form onSubmit={handleUpdate}>
              <div className="form-control hidden">
                <label htmlFor="" className="label font-bold text-xl">
                  Id
                </label>
                <input
                  type="number"
                  value={indicatorId}
                  onChange={(e) => setIndicatorId(parseInt(e.target.value))}
                  className="input w-full input-bordered"
                />
              </div>

              <div className="form-control">
                <label htmlFor="" className="label font-bold text-xl">
                  Indicator Name
                </label>
                <input
                  type="text"
                  value={indicatorName}
                  onChange={(e) => setIndicatorName(e.target.value)}
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
