// pages/gasStationTransaction.js

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";

// Định nghĩa schema validation với Yup
const schema = yup.object().shape({
  transaction_time: yup.date().required("Vui lòng chọn thời gian."),
  quantity: yup
    .number()
    .required("Vui lòng nhập số lượng.")
    .positive()
    .integer(),
  pump_number: yup.string().required("Vui lòng chọn trụ."),
  revenue: yup.number().required("Vui lòng nhập doanh thu.").positive(),
  price_per_liter: yup.number().required("Vui lòng nhập đơn giá.").positive(),
});

const GasStationTransactionForm = () => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [pumpOptions] = useState([
    { value: "Trụ 1", label: "Trụ 1" },
    { value: "Trụ 2", label: "Trụ 2" },
    { value: "Trụ 3", label: "Trụ 3" },
  ]);

  const onSubmit = (data) => {
    alert("Giao dịch đã được cập nhật thành công!");
    console.log(data);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Nhập giao dịch bán xăng</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Thời gian */}
        <div className="border rounded-md p-4">
          <label className="block text-sm font-medium mb-1">Thời gian:</label>
          <Controller
            name="transaction_time"
            control={control}
            render={({ field }) => (
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  field.onChange(date);
                }}
                showTimeSelect
                dateFormat="Pp"
                placeholderText="Chọn ngày giờ"
                className={`border ${
                  errors.transaction_time ? "border-red-500" : "border-gray-300"
                } rounded-md p-2 w-full`}
              />
            )}
          />
          {errors.transaction_time && (
            <span className="text-red-500 text-sm">
              {errors.transaction_time.message}
            </span>
          )}
        </div>

        {/* Số lượng */}
        <div className="border rounded-md p-4">
          <label className="block text-sm font-medium mb-1">
            Số lượng (lít):
          </label>
          <input
            type="number"
            {...register("quantity")}
            placeholder="Nhập số lượng"
            className={`border ${
              errors.quantity ? "border-red-500" : "border-gray-300"
            } rounded-md p-2 w-full`}
          />
          {errors.quantity && (
            <span className="text-red-500 text-sm">
              {errors.quantity.message}
            </span>
          )}
        </div>

        {/* Trụ */}
        <div className="border rounded-md p-4">
          <label className="block text-sm font-medium mb-1">Trụ:</label>
          <Controller
            name="pump_number"
            control={control}
            render={({ field }) => (
              <Select
                options={pumpOptions}
                {...field}
                placeholder="Chọn trụ"
                className={`border ${
                  errors.pump_number ? "border-red-500" : "border-gray-300"
                } rounded-md p-2`}
              />
            )}
          />
          {errors.pump_number && (
            <span className="text-red-500 text-sm">
              {errors.pump_number.message}
            </span>
          )}
        </div>

        {/* Doanh thu */}
        <div className="border rounded-md p-4">
          <label className="block text-sm font-medium mb-1">Doanh thu:</label>
          <input
            type="number"
            {...register("revenue")}
            placeholder="Nhập doanh thu"
            className={`border ${
              errors.revenue ? "border-red-500" : "border-gray-300"
            } rounded-md p-2 w-full`}
          />
          {errors.revenue && (
            <span className="text-red-500 text-sm">
              {errors.revenue.message}
            </span>
          )}
        </div>

        {/* Đơn giá */}
        <div className="border rounded-md p-4">
          <label className="block text-sm font-medium mb-1">Đơn giá:</label>
          <input
            type="number"
            {...register("price_per_liter")}
            placeholder="Nhập đơn giá"
            className={`border ${
              errors.price_per_liter ? "border-red-500" : "border-gray-300"
            } rounded-md p-2 w-full`}
          />
          {errors.price_per_liter && (
            <span className="text-red-500 text-sm">
              {errors.price_per_liter.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600"
        >
          Cập nhật
        </button>
      </form>
    </div>
  );
};

export default GasStationTransactionForm;
