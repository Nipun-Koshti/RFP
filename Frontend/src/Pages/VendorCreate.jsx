import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vendorSchema } from "../services/Validations/vendor.validation";
import {
  Save,
  Plus,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Hash,
  Users,
  BriefcaseBusiness,
} from "lucide-react";

import { registerVendor } from "../services/Api/vendor.api";
import { useNavigate } from "react-router-dom";

const VendorCreate = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      vendorName: "",
      email: "",
      phone: "",
      gst: "",
      address: {
        street: "",
        city: "",
        state: "",
      },
      personal: [{ name: "", email: "", phone: "" }], // Start with one contact
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "personal",
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await registerVendor(data);
    } catch (err) {
      alert(err || "Something went wrong");
    }

    alert("Vendor created successfully! Check console for data.");
    reset(); 
    navigate(-1)
  };

  // Helper component for error display
  const ErrorMessage = ({ error }) =>
    error ? <p className="text-red-500 text-xs mt-1">{error.message}</p> : null;

  // Input styling
  const inputClass =
    "w-full p-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition duration-150";

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 md:p-12 lg:p-16">
      <div className="mx-auto max-w-4xl">
        <header className="pb-6 mb-8 border-b border-gray-200">
          <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-teal-600" /> Create New Vendor
          </h1>
          <p className="mt-2 text-gray-500">
            Enter the official and contact details for the new supplier.
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          {/* === 1. Official Vendor Details === */}
          <section className="bg-white p-8 rounded-xl shadow-lg space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 border-b pb-3 mb-4">
              <BriefcaseBusiness className="w-6 h-6 text-indigo-500" /> Company
              Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vendor Name */}
              <div>
                <label
                  htmlFor="vendorName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Vendor Name
                </label>
                <input
                  id="vendorName"
                  type="text"
                  {...register("vendorName")}
                  className={inputClass}
                  disabled={isSubmitting}
                />
                <ErrorMessage error={errors.vendorName} />
              </div>

              {/* Company Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Company Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className={inputClass}
                  disabled={isSubmitting}
                />
                <ErrorMessage error={errors.email} />
              </div>

              {/* Company Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  className={inputClass}
                  disabled={isSubmitting}
                />
                <ErrorMessage error={errors.phone} />
              </div>

              {/* GST Number */}
              <div>
                <label
                  htmlFor="gst"
                  className="block text-sm font-medium text-gray-700"
                >
                  GST Number
                </label>
                <input
                  id="gst"
                  type="text"
                  {...register("gst")}
                  className={inputClass}
                  disabled={isSubmitting}
                />
                <ErrorMessage error={errors.gst} />
              </div>
            </div>
          </section>

          {/* === 2. Address Details === */}
          <section className="bg-white p-8 rounded-xl shadow-lg space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 border-b pb-3 mb-4">
              <MapPin className="w-6 h-6 text-indigo-500" /> Official Address
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Street */}
              <div>
                <label
                  htmlFor="address.street"
                  className="block text-sm font-medium text-gray-700"
                >
                  Street Address
                </label>
                <input
                  id="address.street"
                  type="text"
                  {...register("address.street")}
                  className={inputClass}
                  disabled={isSubmitting}
                />
                <ErrorMessage error={errors.address?.street} />
              </div>

              {/* City */}
              <div>
                <label
                  htmlFor="address.city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <input
                  id="address.city"
                  type="text"
                  {...register("address.city")}
                  className={inputClass}
                  disabled={isSubmitting}
                />
                <ErrorMessage error={errors.address?.city} />
              </div>

              {/* State */}
              <div>
                <label
                  htmlFor="address.state"
                  className="block text-sm font-medium text-gray-700"
                >
                  State
                </label>
                <input
                  id="address.state"
                  type="text"
                  {...register("address.state")}
                  className={inputClass}
                  disabled={isSubmitting}
                />
                <ErrorMessage error={errors.address?.state} />
              </div>
            </div>
          </section>

          {/* === 3. Personal Contacts (Dynamic Array) === */}
          <section className="bg-white p-8 rounded-xl shadow-lg space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 border-b pb-3 mb-4">
              <Users className="w-6 h-6 text-indigo-500" /> Key Contacts
            </h2>
            <ErrorMessage error={errors.personal} />{" "}
            {/* Show global array error (e.g., minimum 1) */}
            {fields.map((item, index) => (
              <div
                key={item.id}
                className="relative p-5 border border-gray-200 rounded-lg bg-gray-50 grid grid-cols-1 md:grid-cols-4 gap-4"
              >
                <p className="col-span-full text-sm font-semibold text-teal-700">
                  Contact #{index + 1}
                </p>

                {/* Name */}
                <div>
                  <label
                    htmlFor={`personal.${index}.name`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    id={`personal.${index}.name`}
                    type="text"
                    {...register(`personal.${index}.name`)}
                    className={inputClass}
                    disabled={isSubmitting}
                  />
                  <ErrorMessage error={errors.personal?.[index]?.name} />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor={`personal.${index}.email`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id={`personal.${index}.email`}
                    type="email"
                    {...register(`personal.${index}.email`)}
                    className={inputClass}
                    disabled={isSubmitting}
                  />
                  <ErrorMessage error={errors.personal?.[index]?.email} />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor={`personal.${index}.phone`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone
                  </label>
                  <input
                    id={`personal.${index}.phone`}
                    type="tel"
                    {...register(`personal.${index}.phone`)}
                    className={inputClass}
                    disabled={isSubmitting}
                  />
                  <ErrorMessage error={errors.personal?.[index]?.phone} />
                </div>

                {/* Remove Button */}
                <div className="flex items-end justify-end">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1 || isSubmitting}
                    className="p-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition disabled:opacity-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            {/* Add Contact Button */}
            <button
              type="button"
              onClick={() => append({ name: "", email: "", phone: "" })}
              disabled={isSubmitting}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition disabled:bg-gray-400"
            >
              <Plus className="w-5 h-5" /> Add Another Contact
            </button>
          </section>

          {/* === Submit Button === */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-3 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300 transform active:scale-98 disabled:bg-gray-400"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" /> Create Vendor
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorCreate;
