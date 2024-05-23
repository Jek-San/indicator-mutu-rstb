"use client";
import React, { useState } from "react";

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
    };
    D: {
      d_name: string;
      data: IndicatorValue[];
    };
  };
}

const Home: React.FC = () => {
  const [indicatorData, setIndicatorData] = useState<{
    indicators: Indicator[];
  }>({
    indicators: [
      {
        id_indicator: 1,
        name: "Edited indicator edsv",
        values: {
          N: {
            n_name:
              "Jumlah pasien yang divisite dokter pada pukul 06.00- 14:00",
            data: [
              { date: "2024-05-01", value: 8 },
              { date: "2024-05-02", value: 1 },
              { date: "2024-05-03", value: 2 },
              { date: "2024-05-18", value: 9 },
              { date: "2024-05-19", value: 2 },
              { date: "2024-05-20", value: 2 },
              { date: "2024-05-21", value: 4 },
              { date: "2024-05-22", value: 7 },
              { date: "2024-05-23", value: 2 },
              { date: "2024-05-28", value: 5 },
              { date: "2024-05-29", value: 8 },
              { date: "2024-05-30", value: 7 },
              { date: "2024-05-31", value: 0 },
            ],
          },
          D: {
            d_name: "Jumlah pasien yang diobservasi daf dadaf",
            data: [
              { date: "2024-05-01", value: 0 },
              { date: "2024-05-02", value: 1 },
            ],
          },
        },
      },
      {
        id_indicator: 2,
        name: "Edited indicator edsv",
        values: {
          N: {
            n_name:
              "Jumlah pasien yang divisite dokter pada pukul 06.00- 14:00",
            data: [
              { date: "2024-05-01", value: 8 },
              { date: "2024-05-02", value: 1 },
              { date: "2024-05-03", value: 2 },
              { date: "2024-05-18", value: 9 },
              { date: "2024-05-19", value: 2 },
              { date: "2024-05-20", value: 2 },
              { date: "2024-05-21", value: 4 },
              { date: "2024-05-22", value: 7 },
              { date: "2024-05-23", value: 2 },
              { date: "2024-05-28", value: 5 },
              { date: "2024-05-29", value: 8 },
              { date: "2024-05-30", value: 7 },
              { date: "2024-05-31", value: 0 },
            ],
          },
          D: {
            d_name: "Jumlah pasien yang diobservasi daf dadaf",
            data: [
              { date: "2024-05-01", value: 0 },
              { date: "2024-05-02", value: 1 },
            ],
          },
        },
      },
    ],
  });

  const fillMissingDates = (data: IndicatorValue[]): IndicatorValue[] => {
    const today = new Date();
    const filledData: IndicatorValue[] = [];
    const startDate = new Date("2024-05-01"); // Assuming start date as May 1st
    const endDate = new Date("2024-05-31"); // Assuming end date as May 31st
    const firstDayOfMonth = new Date(today.getFullYear(), 4, 1); // Last day of the current month
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );

    // console.log("startDate ", startDate, "firstDayOfMonth ", firstDayOfMonth);

    for (
      let currentDate = new Date(startDate);
      currentDate <= endDate;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      const dateString = currentDate.toISOString().split("T")[0];

      const existingData = data.find((item) => item.date === dateString);
      if (existingData) {
        filledData.push(existingData);
      } else {
        filledData.push({ date: dateString, value: 0 }); // Inserting placeholder value
      }
    }

    return filledData;
  };

  const handleValueChange = (
    indicatorIndex: number,
    dataType: "N" | "D",
    date: string,
    newValue: number
  ) => {
    setIndicatorData((prevData) => {
      const newData = { ...prevData };
      newData.indicators[indicatorIndex].values[dataType].data =
        newData.indicators[indicatorIndex].values[dataType].data.map((item) =>
          item.date === date ? { ...item, value: newValue } : item
        );
      return newData;
    });
  };

  const renderEditableCellValue = (
    value: number | undefined,
    indicatorIndex: number,
    dataType: "N" | "D",
    date: string
  ) => (
    <input
      type="number"
      value={value === undefined ? "" : value}
      onChange={(e) =>
        handleValueChange(
          indicatorIndex,
          dataType,
          date,
          parseInt(e.target.value)
        )
      }
      className="w-16 h-8 text-center border border-gray-300 rounded"
    />
  );

  const renderCell = (
    value: number | undefined,
    indicatorIndex: number,
    dataType: "N" | "D",
    date: string
  ) => {
    if (value !== undefined) {
      return renderEditableCellValue(value, indicatorIndex, dataType, date);
    } else {
      return <div className="text-center">No Data</div>;
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Data Table</h2>
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse">
          <thead className="text-black">
            <tr>
              <th rowSpan={2} className="border bg-red text-center px-4 py-2">
                No
              </th>
              <th rowSpan={2} className="border px-4 py-2">
                Nama Indikator
              </th>
              <th colSpan={31} className="border px-4 py-2">
                Pemantauan Harian*)
              </th>
              <th rowSpan={2} className="border px-4 py-2">
                JML
              </th>
              <th rowSpan={2} className="border px-4 py-2">
                %
              </th>
            </tr>

            <tr>
              {Array.from({ length: 31 }, (_, index) => (
                <th key={index + 1} className="border px-4 py-2">
                  {index + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {indicatorData.indicators.map((indicator, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td className="border p-4">{index + 1}</td>
                  <td colSpan={34} className="border p-4">
                    {indicator.name}
                  </td>
                </tr>
                <tr>
                  <td className="border p-4">N</td>
                  <td className="border p-4">{indicator.values.N.n_name}</td>
                  {fillMissingDates(indicator.values.N.data).map(
                    ({ date, value }) => (
                      <td key={date} className="border p-4">
                        {renderCell(
                          value,
                          index,
                          "N",
                          `2024-05-${date.split("-")[2]}`
                        )}
                      </td>
                    )
                  )}
                  <td className="border p-4"></td>
                  <td className="border p-4"></td>
                </tr>
                <tr>
                  <td className="border p-4">D</td>
                  <td className="border p-4">{indicator.values.D.d_name}</td>
                  {fillMissingDates(indicator.values.D.data).map(
                    ({ date, value }) => (
                      <td key={date} className="border p-4">
                        {renderCell(
                          value,
                          index,
                          "D",
                          `2024-05-${date.split("-")[2]}`
                        )}
                      </td>
                    )
                  )}
                  <td className="border p-4"></td>
                  <td className="border p-4"></td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
