import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { toast } from "react-toastify";

const validateSchema = yup.object().shape({
  transaction_time: yup.date().required("Vui lòng chọn thời gian."),
  quantity: yup
    .number()
    .required("Vui lòng nhập số lượng.")
    .min(0, "Vui lòng nhập số lớn hơn hoặc bằng 0.")
    .typeError("Vui lòng nhập số thực."),
  pump_number: yup.string().required("Vui lòng chọn trụ."),
  revenue: yup
    .number()
    .required("Vui lòng nhập doanh thu.")
    .min(0, "Vui lòng nhập số lớn hơn hoặc bằng 0.")
    .typeError("Vui lòng nhập số thực."),
  price_per_liter: yup
    .number()
    .required("Vui lòng nhập đơn giá.")
    .min(0, "Vui lòng nhập số lớn hơn hoặc bằng 0.")
    .typeError("Vui lòng nhập số thực."),
});

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [pumpOptions] = useState([
    { value: "Trụ 1", label: "Trụ 1" },
    { value: "Trụ 2", label: "Trụ 2" },
    { value: "Trụ 3", label: "Trụ 3" },
  ]);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validateSchema),
    defaultValues: {
      transaction_time: new Date(),
      quantity: 0,
      pump_number: null,
      revenue: 0,
      price_per_liter: 0,
    },
  });

  const onSubmit = (data) => {
    data.quantity = parseFloat(data.quantity);
    data.revenue = parseFloat(data.revenue);
    data.price_per_liter = parseFloat(data.price_per_liter);

    toast.success("Giao dịch đã được cập nhật thành công!");
    console.log(data);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full md:w-1/3 mx-auto bg-white p-8 mt-10 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Nhập giao dịch </h1>
            <button
              type="submit"
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition"
            >
              Cập nhật
            </button>
          </div>

          <div className="relative w-full">
            <label className="absolute left-2 top-2 text-gray-500 text-sm transition-all duration-200 transform scale-75 origin-top-left">
              Thời gian
            </label>
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
                  wrapperClassName="w-full"
                  className={`border ${
                    errors.transaction_time
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md p-2 w-full mt-6 shadow-sm focus:outline-none  focus:border-blue-500`}
                />
              )}
            />
            {errors.transaction_time && (
              <span className="text-red-500 text-sm">
                {errors.transaction_time.message}
              </span>
            )}
          </div>

          <div className="relative">
            <label className="absolute left-2 top-2 text-gray-500 text-sm transition-all duration-200 transform scale-75 origin-top-left">
              Số lượng
            </label>
            <input
              aria-label="quantity"
              type="text"
              {...register("quantity")}
              placeholder=" "
              className={`border ${
                errors.quantity ? "border-red-500" : "border-gray-300"
              } rounded-md p-2 w-full mt-6 shadow-sm focus:outline-none  focus:border-blue-500`}
            />
            {errors.quantity && (
              <span className="text-red-500 text-sm">
                {errors.quantity.message}
              </span>
            )}
          </div>

          <div className="relative">
            <label className="ml-2 text-gray-500 text-xs transition-all duration-200 transform scale-75 origin-top-left">
              Trụ
            </label>
            <Controller
              name="pump_number"
              control={control}
              render={({ field }) => (
                <Select
                  options={pumpOptions}
                  onChange={(selectedOption) =>
                    field.onChange(selectedOption ? selectedOption.value : "")
                  }
                  className={` ${
                    errors.pump_number ? "border border-red-500" : ""
                  }`}
                  placeholder="Chọn trụ"
                />
              )}
            />
            {errors.pump_number && (
              <span className="text-red-500 text-sm">
                {errors.pump_number.message}
              </span>
            )}
          </div>

          <div className="relative">
            <label className="absolute left-2 top-2 text-gray-500 text-sm transition-all duration-200 transform scale-75 origin-top-left">
              Doanh thu
            </label>
            <input
              type="text"
              {...register("revenue")}
              placeholder=" "
              className={`border ${
                errors.revenue ? "border-red-500" : "border-gray-300"
              } rounded-md p-2 w-full mt-6 shadow-sm focus:outline-none  focus:border-blue-500`}
            />
            {errors.revenue && (
              <span className="text-red-500 text-sm">
                {errors.revenue.message}
              </span>
            )}
          </div>

          <div className="relative">
            <label className="absolute left-2 top-2 text-gray-500 text-sm transition-all duration-200 transform scale-75 origin-top-left">
              Đơn giá
            </label>
            <input
              type="text"
              {...register("price_per_liter")}
              placeholder=" "
              className={`border ${
                errors.price_per_liter ? "border-red-500" : "border-gray-300"
              } rounded-md p-2 w-full mt-6 shadow-sm focus:outline-none focus:border-blue-500`}
            />
            {errors.price_per_liter && (
              <span className="text-red-500 text-sm">
                {errors.price_per_liter.message}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
