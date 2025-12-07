import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  DollarSign,
  List,
  Hash,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Edit,
  Save,
  X,
  Plus,
} from "lucide-react";

import { getOneQuote, updateQuote } from "../services/Api/quote.api";

const QuoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quote, setQuote] = useState(null);
  const [editData, setEditData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Quote
  useEffect(() => {
    if (!id) return;

    const loadQuote = async () => {
      try {
        let response = await getOneQuote(id);
        if (!response) {
          response = {
            _id: "000000000000000000000000",
            vendor: "000000000000000000000000",
            amount: 0,
            quotevalue: [
              {
                _id: "000000000000000000000001",
                name: "NA",
                quantity: 0,
                unitPrice: 0,
                total: 0,
                description: "NA",
              },
            ],
          };
        }
        console.log("-----response-----", response);
        setQuote(response);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch quotation");
      } finally {
        setIsLoading(false);
      }
    };

    loadQuote();
  }, [id]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
      case "Submitted":
        return "text-indigo-700 bg-indigo-100 border-indigo-300";

      case "Approved":
        return "text-green-700 bg-green-100 border-green-300";

      case "Rejected":
        return "text-red-700 bg-red-100 border-red-300";

      default:
        return "text-gray-700 bg-gray-100 border-gray-300";
    }
  };

  const StatusIcon = ({ status }) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="w-5 h-5" />;
      case "Rejected":
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  // Reject Handler
  const handleReject = async () => {
    // if (!window.confirm("Reject this quotation?")) return;

    // try {
    //   await updateQuote(id, { status: "Rejected" });
    //   alert("Quotation rejected.");
    //   window.location.reload();
    // } catch {
    //   alert("Failed to reject quotation.");
    // }
  };

  // Enable Editing
  const startEditing = () => {
    setEditData(JSON.parse(JSON.stringify(quote))); // Deep copy
    setIsEditing(true);
  };

  // Cancel Editing
  const cancelEditing = () => {
    setIsEditing(false);
    setEditData(null);
  };

  // Handle field change
  const handleChange = (index, field, value) => {
    const updated = { ...editData };
    updated.quotevalue[index][field] = value;
    setEditData(updated);
  };

  // Add a new line item
  const addLineItem = () => {
    const updated = { ...editData };
    updated.quotevalue.push({
      name: "",
      quantity: 1,
      unitPrice: 0,
      description: "",
    });
    setEditData(updated);
  };

  // Remove line item
  const removeLineItem = (index) => {
    const updated = { ...editData };
    updated.quotevalue.splice(index, 1);
    setEditData(updated);
  };

  // Save Edited Quote
  const handleSave = async () => {
    try {
      const res = await updateQuote(editData,id);
      alert("Quotation updated successfully");

      setQuote(res);
      setIsEditing(false);
    } catch (err) {
      alert("Failed to update quote");
      console.log(err);
    }
  };

  if (isLoading)
    return (
      <div className="p-16 text-center text-xl text-gray-500">
        Loading quotation…
      </div>
    );

  if (!quote)
    return (
      <div className="p-16 text-center text-xl text-red-500">
        Quote not found.
      </div>
    );

  const data = isEditing ? editData : quote;

  return (
    <div className="bg-gray-50 p-4 sm:p-8 md:p-12 lg:p-16 animate-fade-in">
      <div className="mx-auto max-w-6xl flex flex-col gap-10">
        {/* HEADER */}
        <header className="border-b border-gray-200 pb-4 flex justify-between items-start flex-wrap gap-4">
          <div>
            <button
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5" /> Back
            </button>

            <p className="text-sm font-semibold text-gray-500 flex items-center gap-2">
              <Hash className="w-4 h-4" /> {data._id}
            </p>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mt-1">
              Vendor Quotation
            </h1>

            <p className="text-lg text-gray-600 mt-1">
              From Vendor:{" "}
              <span className="font-bold">{data.vendor?.vendorName}</span>
            </p>
          </div>

          {/* EDIT / REJECT / SAVE BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            {/* STATUS BADGE */}
            <div
              className={`px-4 py-2 rounded-xl font-bold uppercase tracking-wider text-sm border-2 shadow-sm 
                    ${getStatusStyle(
                      data.status ?? "Submitted"
                    )} flex items-center gap-2`}
            >
              <StatusIcon status={data.status ?? "Submitted"} />
              {data.status ?? "Submitted"}
            </div>

            {!isEditing ? (
              <>
                <button
                  onClick={startEditing}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" /> Edit
                </button>

                <button
                  onClick={handleReject}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 shadow-md transition"
                >
                  Reject
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 shadow-md transition flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save
                </button>

                <button
                  onClick={cancelEditing}
                  className="px-4 py-2 rounded-xl bg-gray-400 text-white hover:bg-gray-500 shadow-md transition flex items-center gap-2"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              </>
            )}
          </div>
        </header>

        {/* QUOTE SUMMARY */}
        <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 animate-slide-up delay-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-indigo-500" />
            Quotation Summary
          </h2>

          <p className="text-3xl font-extrabold text-indigo-900">
            ₹{data.amount?.toLocaleString("en-IN")}
          </p>
        </div>

        {/* LINE ITEMS */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden animate-slide-up delay-400">
          <h2 className="text-2xl font-bold text-gray-800 p-6 flex items-center gap-2 border-b border-gray-100">
            <List className="w-6 h-6 text-teal-500" /> Line Items
          </h2>

          <div className="overflow-x-auto p-4">
            {isEditing && (
              <button
                className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2"
                onClick={addLineItem}
              >
                <Plus className="w-4 h-4" /> Add Item
              </button>
            )}

            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50 text-left text-xs uppercase text-gray-500 tracking-wider">
                  <th className="p-4 font-bold">Name</th>
                  <th className="p-4 font-bold">Description</th>
                  <th className="p-4 font-bold text-right">Qty</th>
                  <th className="p-4 font-bold text-right">Unit Price</th>
                  <th className="p-4 font-bold text-right">Subtotal</th>
                  {isEditing && <th></th>}
                </tr>
              </thead>

              <tbody>
                {data.quotevalue.map((item, idx) => (
                  <tr key={item._id || idx} className="border-b">
                    <td className="p-3">
                      {isEditing ? (
                        <input
                          value={item.name}
                          onChange={(e) =>
                            handleChange(idx, "name", e.target.value)
                          }
                          className="w-full border p-2 rounded"
                        />
                      ) : (
                        item.name
                      )}
                    </td>

                    <td className="p-3">
                      {isEditing ? (
                        <input
                          value={item.description}
                          onChange={(e) =>
                            handleChange(idx, "description", e.target.value)
                          }
                          className="w-full border p-2 rounded"
                        />
                      ) : (
                        item.description
                      )}
                    </td>

                    <td className="p-3 text-right">
                      {isEditing ? (
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleChange(
                              idx,
                              "quantity",
                              Number(e.target.value)
                            )
                          }
                          className="w-full border p-2 rounded text-right"
                        />
                      ) : (
                        item.quantity
                      )}
                    </td>

                    <td className="p-3 text-right">
                      {isEditing ? (
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) =>
                            handleChange(
                              idx,
                              "unitPrice",
                              Number(e.target.value)
                            )
                          }
                          className="w-full border p-2 rounded text-right"
                        />
                      ) : (
                        `₹${Number(item.unitPrice).toLocaleString("en-IN")}`
                      )}
                    </td>

                    <td className="p-3 text-right font-bold">
                      ₹
                      {(item.quantity * Number(item.unitPrice)).toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    {isEditing && (
                      <td className="p-3 text-center">
                        <button
                          onClick={() => removeLineItem(idx)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* STYLE ANIMATIONS */}
      <style>{`
        .animate-fade-in { animation: fadeIn 0.5s ease-out both; }
        .animate-slide-up { animation: slideUp 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default QuoteDetail;
