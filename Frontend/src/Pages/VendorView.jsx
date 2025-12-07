import {
  Hash,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Clock,
  UserCheck,
  UserX,
  Briefcase,
  Calendar,
  Users,
  BriefcaseBusiness,
  Trash2,
  Edit,
  Save,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { deleteVendorById, getVendorById } from "../services/Api/vendor.api";
import { vendorSchema } from "../services/Validations/vendor.validation";
import { updateVendorById } from "../services/Api/vendor.api";

const VendorView = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [supplier, setSupplier] = useState(null); // Holds the official vendor data
  const [formData, setFormData] = useState({}); // Holds data during editing
  const [isEditing, setIsEditing] = useState(false); // New state to control edit mode
  const navigate =  useNavigate()


  // --- Utility Functions ---
  const inputClass =
    "w-full p-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition duration-150 text-sm";
  const displayClass = "text-base font-semibold text-gray-900";
  const detailLabelClass = "w-1/3 text-sm font-medium text-gray-600";
  const detailValueClass = "w-2/3 text-sm font-medium text-gray-900";

  useEffect(() => {
    const fetchVendor = async (id) => {
      try {
        const data = await getVendorById(id);
        setSupplier(data);
        console.log("yuyuyuyu------->", data);
        setIsLoading(false);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchVendor(id);
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
    setFormData(supplier);
  };

  const handleCancel = () => {
    setIsEditing(false);

    setFormData(supplier);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const [_, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    try {
      const validatedData = vendorSchema.parse(formData);

      updateVendorById(id, formData);

      setSupplier(validatedData);
      setIsEditing(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = ()=> {
    const confirmation =  confirm("Are you sure you wnat to delete the vendor")

    if(!confirmation) return;

    deleteVendorById(id);
    alert("Vendor delteted Sucessfully!!!!!!!!!!!");
    navigate("/vendor")
  }

  if (isLoading) {
    return (
      <div className="p-16 text-center text-xl text-gray-500">
        Loading vendor details...
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="text-red-700 p-16 bg-gray-50">
        <h2 className="text-center text-2xl font-semibold">
          The Vendor with the ID - **{id}** does not exist
        </h2>
      </div>
    );
  }

  const address = supplier.address || {};
  const personalContacts = supplier.personal || [];
  const displayData = isEditing ? formData : supplier;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 md:p-12 lg:p-16 animate-fade-in">
      <div className="mx-auto max-w-6xl flex flex-col gap-10">
        {/* 1. Header & Action Buttons */}
        <header className="border-b border-gray-200 pb-4 flex justify-between items-start flex-wrap gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-500 flex items-center gap-2">
              <Hash className="w-4 h-4 text-gray-400" />
              {displayData._id || "N/A"}
            </p>
            {isEditing ? (
              <input
                type="text"
                name="vendorName"
                value={displayData.vendorName}
                onChange={handleChange}
                className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mt-1 bg-transparent border-b border-indigo-400 focus:outline-none"
              />
            ) : (
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mt-1">
                {displayData.vendorName}
              </h1>
            )}
          </div>

          <div className="flex gap-3">
            {isEditing ? (
              <>
                {/* Save Button */}
                <button
                  onClick={handleSave}
                  className="px-5 py-2.5 bg-green-600 text-white rounded-xl shadow-md 
                    hover:bg-green-700 hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                {/* Cancel Button */}
                <button
                  onClick={handleCancel}
                  className="px-5 py-2.5 bg-gray-400 text-white rounded-xl shadow-md 
                    hover:bg-gray-500 hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel
                </button>
              </>
            ) : (
              <>
                {/* Edit Button */}
                <button
                  onClick={handleEdit}
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl shadow-md 
                    hover:bg-indigo-700 hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                {/* Delete Button */}
                <button
                  onClick={handleDelete}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-xl shadow-md 
                    hover:bg-red-700 hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </>
            )}
          </div>
        </header>

        {/* --- Main Content Cards --- */}

        {/* 2. Primary Contact and Financial Summary Card */}
        <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 animate-slide-up delay-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-teal-500" /> Primary Contact &
            Financials
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Email */}
            <EditableDetail
              label="Primary Email"
              icon={Mail}
              name="email"
              value={displayData.email}
              isEditing={isEditing}
              onChange={handleChange}
              type="email"
            />
            {/* Phone */}
            <EditableDetail
              label="Primary Phone"
              icon={Phone}
              name="phone"
              value={displayData.phone}
              isEditing={isEditing}
              onChange={handleChange}
              type="tel"
            />
            {/* GST Number */}
            <EditableDetail
              label="GST Number"
              icon={Hash}
              name="gst"
              value={displayData.gst}
              isEditing={isEditing}
              onChange={handleChange}
              type="text"
            />
            {/* Registration Date (Not editable) */}
            <div className="flex flex-col gap-1 p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <Calendar className="w-4 h-4 text-teal-500" /> Registered Since
              </div>
              <p className={displayClass}>
                {displayData.createdAt
                  ? new Date(displayData.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Address Details and Personal Contacts (Flex layout) */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 3a. Address Details Card */}
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden animate-slide-up delay-300 lg:w-1/2">
            <h2 className="text-2xl font-bold text-gray-800 p-6 flex items-center gap-2 border-b border-gray-100">
              <MapPin className="w-6 h-6 text-indigo-500" /> Official Address
            </h2>

            <div className="divide-y divide-gray-100">
              {/* Street */}
              <DetailRow
                label="Street"
                name="address.street"
                value={displayData.address?.street}
                isEditing={isEditing}
                onChange={handleChange}
              />
              {/* City */}
              <DetailRow
                label="City"
                name="address.city"
                value={displayData.address?.city}
                isEditing={isEditing}
                onChange={handleChange}
              />
              {/* State */}
              <DetailRow
                label="State"
                name="address.state"
                value={displayData.address?.state}
                isEditing={isEditing}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* 3b. Personal Contacts Table (Not editable in this simple view) */}
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden animate-slide-up delay-400 lg:w-1/2">
            <h2 className="text-2xl font-bold text-gray-800 p-6 flex items-center gap-2 border-b border-gray-100">
              <Users className="w-6 h-6 text-yellow-600" /> Key Contacts (
              {personalContacts.length})
            </h2>
            <div className="overflow-x-auto">
              {personalContacts.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs uppercase text-gray-500 tracking-wider">
                      <th className="p-4 font-bold">Name</th>
                      <th className="p-4 font-bold">
                        <Mail className="w-4 h-4 inline" /> Email
                      </th>
                      <th className="p-4 font-bold">
                        <Phone className="w-4 h-4 inline" /> Phone
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {personalContacts.map((contact, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition">
                        <td className="p-4 text-sm font-medium text-gray-900">
                          {contact.name}
                        </td>
                        <td className="p-4 text-sm text-gray-700">
                          {contact.email}
                        </td>
                        <td className="p-4 text-sm text-gray-700">
                          {contact.phone}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="p-6 text-gray-500 italic text-sm">
                  No secondary contact personnel listed.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-400 mt-4">
          End of Vendor Details for {displayData._id}.
        </div>
      </div>
      {/* Reusing animation styles */}
      <style>{`
        .animate-fade-in { animation: fadeIn 0.5s ease-out both; }
        .animate-slide-up { animation: slideUp 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default VendorView;

// --- Helper Components for Clean Code ---

// Component for the card-style summary details
const EditableDetail = ({
  label,
  icon: Icon,
  name,
  value,
  isEditing,
  onChange,
  type = "text",
}) => {
  const inputClass =
    "w-full p-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition duration-150 text-sm";
  const displayClass = "text-base font-semibold text-gray-900";

  return (
    <div className="flex flex-col gap-1 p-3 border border-gray-200 rounded-lg">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
        <Icon className="w-4 h-4 text-teal-500" /> {label}
      </div>
      {isEditing ? (
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          className={inputClass}
        />
      ) : (
        <p className={displayClass} title={value}>
          {value || "N/A"}
        </p>
      )}
    </div>
  );
};

// Component for the row-style address details
const DetailRow = ({
  label,
  name,
  value,
  isEditing,
  onChange,
  type = "text",
}) => {
  const inputClass =
    "w-full p-1 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-150 text-sm";
  const detailLabelClass = "w-1/3 text-sm font-medium text-gray-600";

  return (
    <div className="flex p-4 hover:bg-gray-50">
      <div className={detailLabelClass}>{label}</div>
      <div className="w-2/3 text-sm font-medium text-gray-900">
        {isEditing ? (
          <input
            type={type}
            name={name}
            value={value || ""}
            onChange={onChange}
            className={inputClass}
          />
        ) : (
          <span className="text-gray-800">{value || "N/A"}</span>
        )}
      </div>
    </div>
  );
};
