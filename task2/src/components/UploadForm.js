import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";
import { formatTime } from "@/utils/formatTime";

const validationSchema = Yup.object().shape({
  file: Yup.mixed()
    .required("File is required")
    .test(
      "fileType",
      "Invalid file format. Please upload an Excel file.",
      (value) =>
        value &&
        value[0] &&
        value[0].type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ),
  startTime: Yup.date()
    .required("Start time is required")
    .test("validTime", "Invalid time format", (value) => {
      return value instanceof Date && !isNaN(value.getTime());
    }),
  endTime: Yup.date()
    .required("End time is required")
    .test("validTime", "Invalid time format", (value) => {
      return value instanceof Date && !isNaN(value.getTime());
    })
    .test(
      "is-greater",
      "End time must be after start time",
      function (endTime) {
        const { startTime } = this.parent;
        if (!startTime || !endTime) return true;

        const startHours = startTime.getHours();
        const startMinutes = startTime.getMinutes();
        const startSeconds = startTime.getSeconds();

        const endHours = endTime.getHours();
        const endMinutes = endTime.getMinutes();
        const endSeconds = endTime.getSeconds();

        if (endHours > startHours) return true;
        if (endHours === startHours && endMinutes > startMinutes) return true;
        if (
          endHours === startHours &&
          endMinutes === startMinutes &&
          endSeconds > startSeconds
        )
          return true;

        return false;
      }
    ),
});

const FileUploadForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const parseTime = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);

    const date = new Date("2000-01-01T00:00:00");
    date.setHours(hours, minutes, seconds, 0);
    return date;
  };

  const [file, setFile] = useState(null);
  const [startTime, setStartTime] = useState(new Date("2000-01-01T05:30:00"));
  const [endTime, setEndTime] = useState(new Date("2000-01-01T21:30:00"));
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setValue("startTime", startTime);
    setValue("endTime", endTime);
  }, [setValue, startTime, endTime]);

  const onSubmit = async (data) => {
    setFile(data.file[0]);
    setErrorMessage("");
    setResult("");

    const calculatedTotal = await calculateTotal(data.file[0]);
    setResult(
      `Total money from ${formatTime(startTime)} to ${formatTime(
        endTime
      )} là: ${calculatedTotal.toLocaleString()} VNĐ`
    );
  };

  const calculateTotal = (uploadedFile) => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            const headers = jsonData[7];

            const hourColumnIndex = headers.findIndex(
              (header) => header === "Giờ"
            );
            const amountColumnIndex = headers.findIndex(
              (header) => header === "Thành tiền (VNĐ)"
            );

            if (hourColumnIndex === -1 || amountColumnIndex === -1) {
              setErrorMessage("Missing required columns in the Excel file");
              return;
            }

            const relevantData = jsonData.slice(8);
            const filteredData = relevantData.filter((row) => {
              if (row.length <= hourColumnIndex) return false;

              const rowTime = parseTime(row[hourColumnIndex]);

              return rowTime >= startTime && rowTime <= endTime;
            });

            const total = filteredData.reduce((sum, row) => {
              const amount = row[amountColumnIndex]
                ? parseFloat(row[amountColumnIndex])
                : 0;
              return sum + amount;
            }, 0);

            resolve(total);
          } catch (error) {
            console.log(error);
            reject("Error processing Excel file");
          }
        };

        reader.onerror = () => {
          reject("Error reading the file");
        };
        reader.readAsArrayBuffer(uploadedFile);
      } catch (error) {
        console.log(error);
        reject("Error calculating total");
      }
    });
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setValue("file", uploadedFile ? [uploadedFile] : []);
  };

  return (
    <div className="w-full md:w-1/3 mx-auto bg-white p-8 mt-10 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-6">Upload Transaction Report</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          {errors.file && (
            <span className="text-red-500">{errors.file.message}</span>
          )}
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            className="border border-gray-400 p-2 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            {...register("file")}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Start Time</label>
          <div className="">
            {errors.startTime && (
              <span className="text-red-500">{errors.startTime.message}</span>
            )}
            <DatePicker
              selected={startTime}
              onChange={(time) => {
                setStartTime(time);
                setValue("startTime", time);
              }}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeFormat="HH:mm:ss"
              dateFormat="HH:mm:ss"
              className={`border p-2 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-300 ${
                errors.startTime ? "border-red-500" : "border-gray-400"
              }`}
              wrapperClassName="w-full"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1">End Time</label>
          <div className="">
            {errors.endTime && (
              <span className="text-red-500">{errors.endTime.message}</span>
            )}
            <DatePicker
              selected={endTime}
              onChange={(time) => {
                setEndTime(time);
                setValue("endTime", time);
              }}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeFormat="HH:mm:ss"
              dateFormat="HH:mm:ss"
              className={`border p-2 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-300 ${
                errors.endTime ? "border-red-500" : "border-gray-400"
              }`}
              wrapperClassName="w-full"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 w-full text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Calculate
        </button>
      </form>

      <div className="mt-4 overflow-y-auto h-16  rounded-md p-2">
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        {result && <div className="text-green-500">{result}</div>}
      </div>
    </div>
  );
};

export default FileUploadForm;
