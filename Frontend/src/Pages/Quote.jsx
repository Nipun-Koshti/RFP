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
  FileText,
  Truck,
  MessageSquare,
  AlertCircle,
  Mail,
  Building2,
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
            vendor: { _id: "000000000000000000000000", vendorName: "Unknown" },
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
            status: "pending",
            deliveryTimeline: "",
            gstDetails: "",
            termsAndConditions: "",
            remarks: "",
            validityPeriod: "",
            vendorResponse: "",
            sourceEmail: null,
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
      case "quoted":
      case "pending":
        return "text-indigo-700 bg-indigo-100 border-indigo-300";
      case "accepted":
        return "text-green-700 bg-green-100 border-green-300";
      case "rejected":
        return "text-red-700 bg-red-100 border-red-300";
      case "clarification_needed":
        return "text-yellow-700 bg-yellow-100 border-yellow-300";
      default:
        return "text-gray-700 bg-gray-100 border-gray-300";
    }
  };

  const StatusIcon = ({ status }) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="w-5 h-5" />;
      case "rejected":
        return <XCircle className="w-5 h-5" />;
      case "clarification_needed":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
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

  // Handle line item field change
  const handleChange = (index, field, value) => {
    const updated = { ...editData };
    updated.quotevalue[index][field] = value;
    setEditData(updated);
  };

  // Handle top-level field change
  const handleFieldChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
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
      const res = await updateQuote(editData, id);
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
    <div className="bg-gray-50 p-4 sm:p-8 md:p-12 lg:p-16 min-h-screen animate-fade-in">
      <div className="mx-auto max-w-7xl flex flex-col gap-8">
        {/* HEADER */}
        <header className="border-b border-gray-200 pb-6 flex justify-between items-start flex-wrap gap-4">
          <div>
            <button
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
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

            <p className="text-lg text-gray-600 mt-2">
              From: <span className="font-bold">{data.vendor || "N/A"}</span>
            </p>
            
            {data.rfp && (
              <p className="text-sm text-gray-500 mt-1">
                RFP: {data.rfp?.subject || data.rfp || "N/A"}
              </p>
            )}
          </div>

          {/* STATUS & ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div
              className={`px-4 py-2 rounded-xl font-bold uppercase tracking-wider text-sm border-2 shadow-sm 
                    ${getStatusStyle(data.status ?? "pending")} flex items-center gap-2`}
            >
              <StatusIcon status={data.status ?? "pending"} />
              {data.status ?? "pending"}
            </div>

            {!isEditing ? (
              <>
                <button
                  onClick={startEditing}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" /> Edit
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

        {/* GRID LAYOUT FOR CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN - Quote Summary & Vendor Info */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* QUOTE AMOUNT */}
            <div className="bg-white shadow-lg rounded-2xl p-6 animate-slide-up delay-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-indigo-500" />
                Total Amount
              </h2>
              <p className="text-4xl font-extrabold text-indigo-900">
                ₹{data.amount?.toLocaleString("en-IN")}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Auto-calculated from line items
              </p>
            </div>

            {/* VENDOR INFORMATION */}
            <div className="bg-white shadow-lg rounded-2xl p-6 animate-slide-up delay-300">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-teal-500" />
                Vendor Details
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500 font-medium">Company</p>
                  <p className="text-gray-900 font-semibold">
                    {data.vendor?.vendorName || "N/A"}
                  </p>
                </div>
                {data.vendor?.email && (
                  <div>
                    <p className="text-gray-500 font-medium">Email</p>
                    <p className="text-gray-900">{data.vendor.email}</p>
                  </div>
                )}
              </div>
            </div>

            {/* TIMELINE & VALIDITY */}
            <div className="bg-white shadow-lg rounded-2xl p-6 animate-slide-up delay-400">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-purple-500" />
                Timeline
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Delivery Timeline</label>
                  {isEditing ? (
                    <input
                      value={data.deliveryTimeline || ""}
                      onChange={(e) => handleFieldChange("deliveryTimeline", e.target.value)}
                      className="w-full mt-1 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g., 15-20 business days"
                    />
                  ) : (
                    <p className="text-gray-900 font-semibold mt-1">
                      {data.deliveryTimeline || "Not specified"}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Quote Validity</label>
                  {isEditing ? (
                    <input
                      value={data.validityPeriod || ""}
                      onChange={(e) => handleFieldChange("validityPeriod", e.target.value)}
                      className="w-full mt-1 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g., 30 days"
                    />
                  ) : (
                    <p className="text-gray-900 font-semibold mt-1">
                      {data.validityPeriod || "Not specified"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* SOURCE EMAIL */}
            {data.sourceEmail && (
              <div className="bg-white shadow-lg rounded-2xl p-6 animate-slide-up delay-500">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Mail className="w-6 h-6 text-blue-500" />
                  Source Email
                </h2>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-500 font-medium">From</p>
                    <p className="text-gray-900 break-all">{data.sourceEmail.from}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">Subject</p>
                    <p className="text-gray-900">{data.sourceEmail.subject}</p>
                  </div>
                  {data.sourceEmail.receivedAt && (
                    <div>
                      <p className="text-gray-500 font-medium">Received</p>
                      <p className="text-gray-900">
                        {new Date(data.sourceEmail.receivedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - Line Items & Details */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* LINE ITEMS */}
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden animate-slide-up delay-200">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <List className="w-6 h-6 text-teal-500" /> Line Items
                </h2>
              </div>

              <div className="p-6">
                {isEditing && (
                  <button
                    className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition shadow-md"
                    onClick={addLineItem}
                  >
                    <Plus className="w-4 h-4" /> Add Item
                  </button>
                )}

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-gray-50 text-left text-xs uppercase text-gray-500 tracking-wider">
                        <th className="p-4 font-bold">Name</th>
                        <th className="p-4 font-bold">Description</th>
                        <th className="p-4 font-bold text-right">Qty</th>
                        <th className="p-4 font-bold text-right">Unit Price</th>
                        <th className="p-4 font-bold text-right">Subtotal</th>
                        {isEditing && <th className="p-4"></th>}
                      </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.quotevalue.map((item, idx) => (
                        <tr key={item._id || idx} className="hover:bg-gray-50 transition">
                          <td className="p-4">
                            {isEditing ? (
                              <input
                                value={item.name}
                                onChange={(e) => handleChange(idx, "name", e.target.value)}
                                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
                              />
                            ) : (
                              <span className="font-medium text-gray-900">{item.name}</span>
                            )}
                          </td>

                          <td className="p-4">
                            {isEditing ? (
                              <input
                                value={item.description}
                                onChange={(e) => handleChange(idx, "description", e.target.value)}
                                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
                              />
                            ) : (
                              <span className="text-gray-600">{item.description}</span>
                            )}
                          </td>

                          <td className="p-4 text-right">
                            {isEditing ? (
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleChange(idx, "quantity", Number(e.target.value))}
                                className="w-20 border border-gray-300 p-2 rounded-lg text-right focus:ring-2 focus:ring-indigo-500"
                              />
                            ) : (
                              <span className="font-medium">{item.quantity}</span>
                            )}
                          </td>

                          <td className="p-4 text-right">
                            {isEditing ? (
                              <input
                                type="number"
                                value={item.unitPrice}
                                onChange={(e) => handleChange(idx, "unitPrice", Number(e.target.value))}
                                className="w-32 border border-gray-300 p-2 rounded-lg text-right focus:ring-2 focus:ring-indigo-500"
                              />
                            ) : (
                              <span>₹{Number(item.unitPrice).toLocaleString("en-IN")}</span>
                            )}
                          </td>

                          <td className="p-4 text-right font-bold text-gray-900">
                            ₹{(item.quantity * Number(item.unitPrice)).toLocaleString("en-IN")}
                          </td>

                          {isEditing && (
                            <td className="p-4 text-center">
                              <button
                                onClick={() => removeLineItem(idx)}
                                className="text-red-600 hover:text-red-800 transition"
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

            {/* GST DETAILS */}
            <div className="bg-white shadow-lg rounded-2xl p-6 animate-slide-up delay-300">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-orange-500" />
                GST Details
              </h2>
              {isEditing ? (
                <input
                  value={data.gstDetails || ""}
                  onChange={(e) => handleFieldChange("gstDetails", e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="GST Number (e.g., 29ABCDE1234F1Z5)"
                />
              ) : (
                <p className="text-gray-900">{data.gstDetails || "Not provided"}</p>
              )}
            </div>

            {/* TERMS & CONDITIONS */}
            <div className="bg-white shadow-lg rounded-2xl p-6 animate-slide-up delay-400">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-red-500" />
                Terms & Conditions
              </h2>
              {isEditing ? (
                <textarea
                  value={data.termsAndConditions || ""}
                  onChange={(e) => handleFieldChange("termsAndConditions", e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg h-32 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter terms and conditions..."
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">
                  {data.termsAndConditions || "Not specified"}
                </p>
              )}
            </div>

            {/* VENDOR RESPONSE */}
            <div className="bg-white shadow-lg rounded-2xl p-6 animate-slide-up delay-500">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-green-500" />
                Vendor Response
              </h2>
              {isEditing ? (
                <textarea
                  value={data.vendorResponse || ""}
                  onChange={(e) => handleFieldChange("vendorResponse", e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg h-24 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Vendor's response or notes..."
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">
                  {data.vendorResponse || "No response provided"}
                </p>
              )}
            </div>

            {/* REMARKS */}
            <div className="bg-white shadow-lg rounded-2xl p-6 animate-slide-up delay-600">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-blue-500" />
                Remarks
              </h2>
              {isEditing ? (
                <textarea
                  value={data.remarks || ""}
                  onChange={(e) => handleFieldChange("remarks", e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg h-24 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Additional remarks..."
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">
                  {data.remarks || "No remarks"}
                </p>
              )}
            </div>

            {/* METADATA */}
            <div className="bg-gray-100 rounded-2xl p-6 animate-slide-up delay-700">
              <h2 className="text-lg font-bold text-gray-700 mb-3">Metadata</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 font-medium">Created At</p>
                  <p className="text-gray-900">{new Date(data.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Last Updated</p>
                  <p className="text-gray-900">{new Date(data.updatedAt).toLocaleString()}</p>
                </div>
                {data.extractedAt && (
                  <div>
                    <p className="text-gray-500 font-medium">Extracted At</p>
                    <p className="text-gray-900">{new Date(data.extractedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STYLE ANIMATIONS */}
      <style>{`
        .animate-fade-in { animation: fadeIn 0.5s ease-out both; }
        .animate-slide-up { animation: slideUp 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default QuoteDetail;