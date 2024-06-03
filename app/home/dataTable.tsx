"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface DataTableProps {
  data: Indicator[];
  month: number;
  year: number;
}

interface IndicatorValue {
  date: string;
  value: number;
}

interface Indicator {
  id_indicator: number;
  name: string;
  values: {
    N: {
      n_name: string;
      data: IndicatorValue[];
      sumN: number;
    };
    D: {
      d_name: string;
      data: IndicatorValue[];
      sumD: number;
    };
    percentageRatio: number;
  };
}

const fillMissingDates = (
  data: IndicatorValue[],
  month: number,
  year: number
): IndicatorValue[] => {
  const filledData: IndicatorValue[] = [];
  const tahun = year.toString();
  const bulan = (month + 1).toString().padStart(2, "0");

  const formatedDateStartDay = `${tahun}-${bulan}-01`;
  let endDate = new Date(year, month, 1);
  endDate.setMonth(endDate.getMonth() + 1);
  endDate.setDate(0);
  endDate.setHours(23, 59, 59, 999);

  for (
    let currentDate = new Date(formatedDateStartDay);
    currentDate <= endDate;
    currentDate.setDate(currentDate.getDate() + 1)
  ) {
    const dateString = currentDate.toISOString().split("T")[0];
    const existingData = data.find((item) => item.date === dateString);
    if (existingData) {
      filledData.push(existingData);
    } else {
      filledData.push({ date: dateString, value: 0 });
    }
  }
  return filledData;
};

const DataTable: React.FC<DataTableProps> = ({ data, month, year }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [indicatorData, setIndicatorData] = useState<Indicator[]>([]);
  const [dayInMonth, setDayInMonth] = useState<number>(
    new Date(year, month + 1, 0).getDate()
  );
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [mutating, setMutating] = useState(false);

  useEffect(() => {
    setDayInMonth(new Date(year, month + 1, 0).getDate());
    const filledIndicatorData = data.map((indicator) => {
      return {
        ...indicator,
        values: {
          N: {
            ...indicator.values.N,
            data: fillMissingDates(indicator.values.N.data, month, year),
          },
          D: {
            ...indicator.values.D,
            data: fillMissingDates(indicator.values.D.data, month, year),
          },
          percentageRatio: calculatePercentageRatio(
            indicator.values.N.sumN,
            indicator.values.D.sumD
          ),
        },
      };
    });
    setIndicatorData(filledIndicatorData);
  }, [data, month, year]);

  const handleValueChange = (
    indicatorIndex: number,
    dataType: "N" | "D",
    date: string,
    newValue: number
  ) => {
    setIndicatorData((prevData) => {
      const newData = [...prevData];
      const updatedIndicator = { ...newData[indicatorIndex] };
      const updatedValues = { ...updatedIndicator.values };
      const updatedData = updatedValues[dataType].data.map((item) =>
        item.date === date ? { ...item, value: newValue } : item
      );
      updatedValues[dataType].data = updatedData;
      updatedIndicator.values = updatedValues;

      // Recalculate sumN and sumD
      updatedIndicator.values.N.sumN = sumCategoryValues(
        updatedIndicator.values.N.data
      );
      updatedIndicator.values.D.sumD = sumCategoryValues(
        updatedIndicator.values.D.data
      );

      // Recalculate percentageRatio
      updatedIndicator.values.percentageRatio = calculatePercentageRatio(
        updatedIndicator.values.N.sumN,
        updatedIndicator.values.D.sumD
      );

      newData[indicatorIndex] = updatedIndicator;
      setIsEdited(true); // Set the indicator as edited

      return newData;
    });
  };

  const handleUpdate = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setMutating(true);

    try {
      const res = await fetch(`${apiUrl}/simrs_indicator_values/update.php`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(indicatorData),
      });
      console.log(indicatorData);
      // Log the full response for debugging
      const responseBody = await res.json();
      console.log("Response:", res);
      console.log("Response body:", responseBody);

      if (res.ok) {
        toast.success("Indicator values added successfully");
        setIsEdited(false);
      } else if (res.status === 500) {
        toast.error("Internal Server Error: " + responseBody.message);
      } else {
        console.log("Error adding menu: ", responseBody.message);
        toast.error("Error adding menu: " + responseBody.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error adding menu: ", error.message);
        toast.error("Error adding menu: " + error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setMutating(false);
      setIsEdited(false);
    }
  };

  const renderEditableCellValue = (
    value: number | undefined,
    indicatorIndex: number,
    dataType: "N" | "D",
    date: string
  ) => (
    <input
      type="number"
      value={value ?? ""}
      onChange={(e) =>
        handleValueChange(
          indicatorIndex,
          dataType,
          date,
          parseInt(e.target.value)
        )
      }
      className="w-full h-10 bg-white text-black text-center border border-gray-300 rounded-md p-2"
    />
  );

  const renderCell = (
    value: number | undefined,
    indicatorIndex: number,
    dataType: "N" | "D",
    date: string
  ) =>
    value !== undefined ? (
      renderEditableCellValue(value, indicatorIndex, dataType, date)
    ) : (
      <div className="text-center">No Data</div>
    );

  const sumCategoryValues = (values: IndicatorValue[]): number => {
    return values.reduce(
      (sum, currentValue) => sum + parseInt(currentValue.value.toString()),
      0
    );
  };

  const calculatePercentageRatio = (sumN: number, sumD: number): number => {
    return (sumN / sumD) * 100;
  };

  return (
    <div className="p-2 bg-gray-100 rounded-sm">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Data Nilai Indicator
      </h2>
      <div className="overflow-x-auto max-h-[26rem] overflow-y-auto">
        <table className="  min-w-full bg-white border  rounded-lg  shadow-md ">
          <thead className="sticky top-0 bg-blue-200 text-gray-700   ">
            <tr className="">
              <th rowSpan={2} className="border  px-4 py-2 text-center  ">
                No
              </th>
              <th
                rowSpan={2}
                className="border px-4 py-2 text-left"
                style={{ minWidth: "300px" }}
              >
                Nama Indikator
              </th>
              <th colSpan={dayInMonth} className="border px-4 py-2 text-center">
                Pemantauan Harian*
              </th>
              <th rowSpan={2} className="border px-4 py-2 text-center">
                JML
              </th>
              <th rowSpan={2} className="border px-4 py-2 text-center">
                %
              </th>
            </tr>
            <tr>
              {Array.from({ length: dayInMonth }, (_, index) => (
                <th key={index + 1} className="border px-2 py-1 text-center">
                  {index + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {indicatorData.length === 0 ? (
              <tr>
                <td colSpan={1000} className="border p-4 text-center">
                  No data available
                </td>
              </tr>
            ) : (
              indicatorData.map((indicator, index) => (
                <React.Fragment key={index}>
                  <tr className="bg-gray-50 hover:bg-gray-100">
                    <td className="border p-4 text-center font-medium text-black">
                      {index + 1}
                    </td>
                    <td
                      colSpan={dayInMonth + 2}
                      className="border p-4 text-left font-semibold text-gray-700"
                    >
                      {indicator.name}
                    </td>
                  </tr>
                  <tr className="bg-white hover:bg-gray-50">
                    <td className="border p-4 text-center text-black">N</td>
                    <td className="border p-4 text-gray-600">
                      {indicator.values.N.n_name}
                    </td>
                    {indicator.values.N.data.map(({ date, value }) => (
                      <td
                        key={date}
                        className="border p-1"
                        style={{ minWidth: "70px" }}
                      >
                        {renderCell(
                          value,
                          index,
                          "N",
                          `${year.toString()}-${(month + 1)
                            .toString()
                            .padStart(2, "0")}-${date.split("-")[2]}`
                        )}
                      </td>
                    ))}
                    <td className="border p-4 text-center text-gray-700">
                      {indicator.values.N.sumN}
                    </td>
                    <td
                      rowSpan={2}
                      className="border text-center p-4 align-middle font-bold text-gray-800"
                    >
                      {indicator.values.percentageRatio.toFixed(2)}%
                    </td>
                  </tr>
                  <tr className="bg-white hover:bg-gray-50">
                    <td className="border p-4 text-center text-black">D</td>
                    <td className="border p-4 text-gray-600">
                      {indicator.values.D.d_name}
                    </td>
                    {indicator.values.D.data.map(({ date, value }) => (
                      <td
                        key={date}
                        className="border p-1"
                        style={{ minWidth: "70px" }}
                      >
                        {renderCell(
                          value,
                          index,
                          "D",
                          `${year.toString()}-${(month + 1)
                            .toString()
                            .padStart(2, "0")}-${date.split("-")[2]}`
                        )}
                      </td>
                    ))}
                    <td className="border p-4 text-center text-gray-700">
                      {indicator.values.D.sumD}
                    </td>
                  </tr>
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-4">
        {mutating ? (
          <button className="loading bg-black"></button>
        ) : (
          <button
            className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            onClick={handleUpdate}
            disabled={!isEdited}
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default DataTable;
