import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  List,
  Users,
  Calendar,
  Hash,
  Trash2,
  Plus,
  Edit,
  Save,
  X,
} from "lucide-react";

import { getOneRfp, updateRfp } from "../services/Api/rfp.api";
import { getNameVendor } from "../services/Api/vendor.api";

const useRfpDetails = (id) => {
  const [rfp, setRfp] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchRfp = async () => {
      try {
        const res = await getOneRfp(id);
        setRfp(res);
      } catch (err) {
        console.error("Failed to fetch RFP:", err);
      }
      setIsLoading(false);
    };

    fetchRfp();
  }, [id]);

  return { rfp, isLoading };
};

const LineItemRow = ({ item, index, editMode, setEditData, editData }) => {
  const updateLineItemField = (key, value) => {
    const updated = [...editData.lineItem];
    updated[index][key] = value;
    setEditData({ ...editData, lineItem: updated });
  };

  const Subtotal = (item.quantity * item.unitPrice).toLocaleString("en-IN");

  return (
    <tr
      key={item._id || index}
      className="border-b border-gray-100 hover:bg-gray-50 transition"
    >
      <td className="p-4 text-sm font-medium text-gray-900 w-1/4">
        {editMode ? (
          <input
            className="border border-gray-300 px-2 py-1 rounded w-full focus:ring-indigo-500 focus:border-indigo-500"
            value={item.name}
            onChange={(e) => updateLineItemField("name", e.target.value)}
          />
        ) : (
          item.name
        )}
      </td>

      <td className="p-4 text-sm text-gray-600 w-1/4">
        {editMode ? (
          <input
            className="border border-gray-300 px-2 py-1 rounded w-full focus:ring-indigo-500 focus:border-indigo-500"
            value={item.description}
            onChange={(e) => updateLineItemField("description", e.target.value)}
          />
        ) : (
          item.description
        )}
      </td>

      <td className="p-4 text-right w-1/12">
        {editMode ? (
          <input
            type="number"
            min="0"
            className="border border-gray-300 px-2 py-1 rounded w-full text-right focus:ring-indigo-500 focus:border-indigo-500"
            value={item.quantity}
            onChange={(e) =>
              updateLineItemField("quantity", Number(e.target.value))
            }
          />
        ) : (
          item.quantity
        )}
      </td>

      <td className="p-4 text-right w-1/12">
        {editMode ? (
          <input
            type="number"
            min="0"
            className="border border-gray-300 px-2 py-1 rounded w-full text-right focus:ring-indigo-500 focus:border-indigo-500"
            value={item.unitPrice}
            onChange={(e) =>
              updateLineItemField("unitPrice", Number(e.target.value))
            }
          />
        ) : (
          `₹${item.unitPrice.toLocaleString("en-IN")}`
        )}
      </td>

      <td className="p-4 text-right font-bold text-indigo-700 w-1/12">
        ₹{Subtotal}
      </td>

      {editMode && (
        <td className="p-4 text-center w-1/12">
          <button
            onClick={() => {
              const updated = editData.lineItem.filter((_, i) => i !== index);
              setEditData({ ...editData, lineItem: updated });
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </td>
      )}
    </tr>
  );
};

const ProposalDetail = () => {
  const { id } = useParams();
  const { rfp, isLoading } = useRfpDetails(id);
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);

  const [vendorList, setVendorList] = useState([]);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState("");

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const list = await getNameVendor();
        setVendorList(list);
      } catch (error) {
        console.error("Vendor fetch failed:", error);
      }
    };
    fetchVendors();
  }, []);

  useEffect(() => {
    if (rfp) {
      setEditData(JSON.parse(JSON.stringify(rfp)));
    }
  }, [rfp]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Submitted":
        return "text-blue-700 bg-blue-100 border-blue-300";
      case "Pending":
        return "text-indigo-700 bg-indigo-100 border-indigo-300";
      case "Cancelled":
        return "text-red-700 bg-red-100 border-red-300";
      case "Quoted":
        return "text-green-700 bg-green-100 border-green-300";
      default:
        return "text-gray-700 bg-gray-100 border-gray-300";
    }
  };

  const StatusIcon = ({ status }) => {
    switch (status) {
      case "Submitted":
      case "Pending":
        return <Clock className="w-5 h-5" />;
      case "Quoted":
        return <CheckCircle className="w-5 h-5" />;
      case "Cancelled":
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const handleSave = async () => {
    try {
      await updateRfp(rfp._id, editData);
      alert("RFP updated successfully!");
      setEditMode(false);
      navigate(0);
    } catch (error) {
      console.error(error);
      alert("Failed to update RFP");
    }
  };

  const handleAddLineItem = () => {
    const newLineItem = {
      _id: Date.now().toString(),
      name: "New Item",
      quantity: 1,
      description: "New Item description",
      unitPrice: 0,
    };
    setEditData((prev) => ({
      ...prev,
      lineItem: [...prev.lineItem, newLineItem],
    }));
  };

  const handleAddVendor = () => {
    if (!selectedVendorId) return alert("Select a vendor");

    const vendorObj = vendorList.find((v) => v._id === selectedVendorId);

    const dummyVendor = {
      _id: Date.now().toString(),
      vendor: { _id: vendorObj._id, vendorName: vendorObj.vendorName },
      quotation: null,
    };

    const updated = [...editData.vendors, dummyVendor];
    setEditData({ ...editData, vendors: updated });

    setSelectedVendorId("");
    setShowVendorModal(false);
  };

  const handleDeleteVendor = (vendorId) => {
    const updated = editData.vendors.filter((v) => v._id !== vendorId);
    setEditData({ ...editData, vendors: updated });
  };

  if (isLoading || !editData) {
    return (
      <div className="p-16 text-center text-xl text-gray-500">
        Loading RFP...
      </div>
    );
  }

  

  return (
    <div className="bg-gray-50 p-4 sm:p-8 md:p-12 lg:p-16">
      <div className="mx-auto max-w-6xl flex flex-col gap-10">
        {/* HEADER */}
        <header className="border-b pb-4 flex justify-between items-start flex-wrap gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-500 flex items-center gap-2">
              <Hash className="w-4 h-4" /> {rfp._id}
            </p>

            {!editMode ? (
              <h1 className="text-4xl font-extrabold">{rfp.subject}</h1>
            ) : (
              <input
                className="text-4xl font-extrabold border-b-2 border-indigo-500 bg-gray-50 px-2"
                value={editData.subject}
                onChange={(e) =>
                  setEditData({ ...editData, subject: e.target.value })
                }
              />
            )}
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`px-4 py-2 rounded-xl border font-bold text-sm flex items-center gap-2 ${getStatusStyle(
                rfp.status
              )}`}
            >
              <StatusIcon status={rfp.status} />
              {rfp.status}
            </div>

            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl"
              >
                <Edit className="w-4 h-4 inline mr-1" /> Edit
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded-xl"
                >
                  <Save className="w-4 h-4 inline mr-1" /> Save
                </button>

                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-xl"
                >
                  <X className="w-4 h-4 inline mr-1" /> Cancel
                </button>
              </>
            )}
          </div>
        </header>

        {/* GENERAL & FINANCIAL */}
        <div className="bg-white shadow-xl rounded-2xl p-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
            <DollarSign className="w-6 h-6 text-teal-500" /> General & Financial
            Overview
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            

            <div className="bg-indigo-50 p-4 rounded-xl border">
              <p className="text-sm text-indigo-700">Budget Cap</p>
              {!editMode ? (
                <p className="text-3xl font-extrabold text-indigo-900">
                  ₹{rfp.budget.toLocaleString("en-IN")}
                </p>
              ) : (
                <input
                  type="number"
                  className="w-full text-3xl border rounded-lg px-3 py-1"
                  value={editData.budget}
                  onChange={(e) =>
                    setEditData({ ...editData, budget: Number(e.target.value) })
                  }
                />
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border flex gap-3 items-center">
              <Calendar className="w-6 h-6 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Delivery Deadline</p>
                {!editMode ? (
                  <p className="font-bold text-lg">
                    {new Date(rfp.delivery).toLocaleDateString()}
                  </p>
                ) : (
                  <input
                    type="date"
                    className="border rounded-lg px-3 py-1"
                    value={editData.delivery.split("T")[0]}
                    onChange={(e) =>
                      setEditData({ ...editData, delivery: e.target.value })
                    }
                  />
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border">
              <p className="text-sm text-gray-600">Billing Address</p>
              {!editMode ? (
                <p className="font-bold text-gray-900 text-sm">
                  {rfp.billingAddress}
                </p>
              ) : (
                <textarea
                  className="border rounded-lg px-3 py-1 w-full"
                  rows="2"
                  value={editData.billingAddress}
                  onChange={(e) =>
                    setEditData({ ...editData, billingAddress: e.target.value })
                  }
                />
              )}
            </div>
          </div>
        </div>

        {/* STATUS + REMARKS */}
        {editMode && (
          <div className="bg-white shadow-xl rounded-2xl p-6 border">
            <h3 className="text-xl font-bold mb-4">RFP Status and Remarks</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Update Status
                </label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={editData.status}
                  onChange={(e) =>
                    setEditData({ ...editData, status: e.target.value })
                  }
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Pending">Pending</option>
                  <option value="Quoted">Quoted</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Remarks
                </label>
                <textarea
                  className="w-full p-2 border rounded-lg"
                  rows="2"
                  value={editData.remark || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, remark: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* BILL OF MATERIALS */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold">Bill of Materials</h2>
            {editMode && (
              <button
                onClick={handleAddLineItem}
                className="px-4 py-2 bg-teal-600 text-white rounded-xl flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Item
              </button>
            )}
          </div>

          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4">Item Name</th>
                <th className="p-4">Description</th>
                <th className="p-4 text-right">Qty</th>
                <th className="p-4 text-right">Unit Price</th>
                <th className="p-4 text-right">Subtotal</th>
                {editMode && <th className="p-4"></th>}
              </tr>
            </thead>

            <tbody>
              {editData.lineItem.map((item, i) => (
                <LineItemRow
                  key={item._id || i}
                  item={item}
                  index={i}
                  editMode={editMode}
                  setEditData={setEditData}
                  editData={editData}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* VENDOR SECTION */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6 text-yellow-600" />
              Vendor Quotes ({editData.vendors.length})
            </h2>

            {editMode && (
              <button
                onClick={() => setShowVendorModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-xl flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Vendor
              </button>
            )}
          </div>

          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4">Vendor</th>
                <th className="p-4 text-right">Quote Amount</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {editData.vendors.map((v) => {
                const vendorName =
                  v.vendor?.vendorName ||
                  (v.vendor ? `ID: ${v.vendor._id}` : "Unknown Vendor");
                const quotedAmount = v.quotation?.amount;
                const isQuoted = !!quotedAmount;

                return (
                  <tr
                    key={v._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-4 font-medium">{vendorName}</td>

                    <td className="p-4 text-right">
                      {isQuoted ? (
                        <span className="text-green-600">
                          ₹{quotedAmount.toLocaleString("en-IN")}
                        </span>
                      ) : (
                        <span className="text-red-500 italic">No Quote</span>
                      )}
                    </td>

                    <td className="p-4 text-center">
                      {!editMode ? (
                        isQuoted ? (
                          <button
                            onClick={() =>
                              navigate(`/quote/${v.quotation._id}`)
                            }
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                          >
                            View Quote
                          </button>
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )
                      ) : (
                        <button
                          onClick={() => handleDeleteVendor(v._id)}
                          className="px-3 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 mx-auto"
                        >
                          <Trash2 className="w-4 h-4" /> Remove
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ADD VENDOR MODAL */}
        {showVendorModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full">
              <h3 className="text-2xl font-bold mb-6">
                Select Vendor to Invite
              </h3>

              <select
                className="border px-4 py-3 w-full rounded-lg"
                value={selectedVendorId}
                onChange={(e) => setSelectedVendorId(e.target.value)}
              >
                <option value="">-- Select a Vendor --</option>
                {vendorList.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.vendorName}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowVendorModal(false)}
                  className="px-5 py-2 bg-gray-300 text-gray-700 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  onClick={handleAddVendor}
                  disabled={!selectedVendorId}
                  className="px-5 py-2 bg-green-600 text-white rounded-xl disabled:bg-gray-400"
                >
                  Add Vendor
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalDetail;
