"use client";
import { useRouter } from "next/navigation";

import { useState } from "react";
import { toast } from "sonner";

type Props = {
  className?: string;
  indicator: Indicator;
  onIndicatorAdded?: () => void;
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

    try {
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

      const responseBody = await res.json();
      console.log("Response:", res);
      console.log("Response body:", responseBody);

      if (res.ok) {
        toast.success("Indicator updated successfully");
        // Clear the input field after successful submission
        setModal(false); // Close the modal after successful submission
        if (props.onIndicatorAdded) {
          props.onIndicatorAdded();
        }
      } else if (res.status === 500) {
        toast.error("Internal Server Error: " + responseBody.message);
      } else {
        toast.error("Error updating indicator: " + responseBody.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Error updating indicator: " + error.message);
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
            <h3 className="font-bold mb-1 text-2xl text-white tracking-widest ">
              Update Indicator
            </h3>
            <form onSubmit={handleUpdate}>
              <div className="form-control hidden">
                <label
                  htmlFor=""
                  className="label font-bold text-xl text-white"
                >
                  Id
                </label>
                <input
                  type="number"
                  value={indicatorId}
                  onChange={(e) => setIndicatorId(parseInt(e.target.value))}
                  className="input w-full input-bordered bg-white"
                />
              </div>

              <div className="form-control">
                <label
                  htmlFor=""
                  className="label font-bold text-xl text-white"
                >
                  Indicator Name
                </label>
                <input
                  type="text"
                  value={indicatorName}
                  onChange={(e) => setIndicatorName(e.target.value)}
                  className="input w-full input-bordered bg-white text-black"
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
                    <button className="btn bg-slate-700" onClick={toggleModal}>
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
