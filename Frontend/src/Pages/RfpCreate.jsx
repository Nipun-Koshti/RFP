import React, { useEffect, useState } from "react";
import {
  Plus,
  X,
  Users,
  Package,
  Sparkles,
  Send,
  Loader2,
} from "lucide-react";
import { getNameVendor } from "../services/Api/vendor.api";
import { getJsonFromFreeText } from "../services/Api/ai.api";
import { createRfp } from "../services/Api/rfp.api";
import { emailSender } from "../services/Api/email.api";
import {rfpValidator} from "../services/Validations/rfp.validation"
import { useNavigate } from "react-router-dom";

const getError = (errors, path) => {
  if (!errors) return null;
  const formatted = errors.format();
  const parts = path.split(".");
  let node = formatted;

  for (let p of parts) {
    if (!node[p]) return null;
    node = node[p];
  }

  return node?._errors?.[0] || null;
};

const Field = ({ label, name, type = "text", value, onChange, errors, placeholder, style }) => (
  <label className="block mb-4">
    <div className="font-semibold text-gray-700 mb-1.5">{label}</div>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${style || ""}`}
    />
    {getError(errors, name) && (
      <p className="text-xs text-red-600 mt-1">{getError(errors, name)}</p>
    )}
  </label>
);

const AIDialog = ({ isOpen, onClose, onSubmit, isProcessing }) => {
  const [prompt, setPrompt] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (prompt.trim()) {
      onSubmit(prompt);
      setPrompt("");
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-fadeIn">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6" />
              <h2 className="text-2xl font-bold">AI-Powered RFP Generator</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              disabled={isProcessing}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-indigo-100 mt-2">
            Describe your RFP requirements in natural language, and AI will generate the form for you
          </p>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <label className="block font-semibold text-gray-700 mb-2">
              Describe Your RFP
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              
              placeholder="Example: I need to purchase 100 laptops with 16GB RAM and 512GB SSD. Budget is ₹5,000,000. 
              Delivery needed by March 15th, 2025. Send this to Tech Suppliers Inc and Global Electronics."
              className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500
               focus:border-transparent resize-none"
              disabled={isProcessing}
            />
            
          </div>

          
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={isProcessing || !prompt.trim()}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg
               font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed
                transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Generate RFP
                </>
              )}
            </button>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CreateRfp() {
  const [form, setForm] = useState({
    subject: "",
    budget: "",
    billingAddress: "",
    delivery: "",
    vendors: [],
    lineItem: [],
    remark: "",
    status: "Submitted",
  });

  const [vendorList, setVendorList] = useState([]);
  const [errors, setErrors] = useState(null);
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    
    const fetchVenderName = async()=>{
      try {
        const data = await getNameVendor()
        setVendorList(data)
      } catch (error) {
        console.log("error occurred during the vendor name fetch",error)
      }
    }
    fetchVenderName()
    
  }, []);

  const populateFormFromAI = (data) => {
    setForm({
      subject: data.subject || "",
      budget: data.budget?.toString() || "",
      billingAddress: data.billingAddress || "",
      delivery: data.delivery || "",
      vendors: data.vendors?.map(v => ({
        vendor: v.vendor || v.vendorId || "",
        quotation: ""
      })) || [],
      lineItem: data.lineItem?.map(item => ({
        name: item.name || "",
        description: item.description || "",
        quantity: item.quantity?.toString() || "0",
        unitPrice: item.unitPrice?.toString() || "0"
      })) || [],
      remark: data.remark || "",
      status: "Submitted",
    });
    setMessage({ type: "info", text: "✨ Form populated by AI. Review and submit when ready!" });
  };

  const handleAISubmit = async (prompt) => {
    setAiProcessing(true);
    try {
     
      const response = await getJsonFromFreeText(prompt)
      console.log("------------response----------",response)

      if (!response) {
        throw new Error("Failed to generate RFP");
      }

  
      populateFormFromAI(response);
      setShowAIDialog(false);

    } catch (err) {
      setMessage({
        type: "error",
        text: "Failed to generate RFP. Please try manual creation or try again.",
      });
      console.error("AI generation error:", err);
    } finally {
      setAiProcessing(false);
    }
  };

  const updateField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const addVendor = () =>
    setForm((prev) => ({
      ...prev,
      vendors: [...prev.vendors, { vendor: "", quotation: "" }],
    }));

  const updateVendor = (i, key, value) =>
    setForm((prev) => {
      const copy = [...prev.vendors];
      copy[i][key] = value;
      return { ...prev, vendors: copy };
    });

  const removeVendor = (i) =>
    setForm((prev) => ({
      ...prev,
      vendors: prev.vendors.filter((_, idx) => idx !== i),
    }));

  const addLineItem = () =>
    setForm((prev) => ({
      ...prev,
      lineItem: [
        ...prev.lineItem,
        { name: "", description: "", quantity: "0", unitPrice: "0" },
      ],
    }));

  const updateLineItem = (i, key, val) =>
    setForm((prev) => {
      const copy = [...prev.lineItem];
      copy[i][key] = val;
      return { ...prev, lineItem: copy };
    });

  const removeLineItem = (i) =>
    setForm((prev) => ({
      ...prev,
      lineItem: prev.lineItem.filter((_, idx) => idx !== i),
    }));

  const handleSubmit = async () => {
    console.log("_______starting_____----_____-----_______")
    setErrors(null);
    setMessage(null);

    const payload = {
      ...form,
      budget: Number(form.budget),
      lineItem: form.lineItem.map((li) => ({
        ...li,
        quantity: Number(li.quantity),
        unitPrice: Number(li.unitPrice),
      })),
      vendors: form.vendors.map((v) => ({
        ...v,
        quotation: null,
      })),
    };

    const validated = rfpValidator.safeParse(payload);
    if (!validated.success) {
      setErrors(validated.error);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);

    try {
      
      const id = await createRfp(validated.data);
      
      
      setMessage({ type: "success", text: "RFP created successfully!" });
      
      
      try {
        
        console.log("Email notification sent");
        await emailSender(id)
      } catch (error) {
        console.log("Error occurred while sending email", error);
      }

      console.log("is this the mail issue")

      setTimeout(() => navigate(-1), 500);
    } catch (err) {
      console.log("is this the mail issue from error ",err)
      setMessage({
        type: "error",
        text: "RFP creation failed. Please try again.",
      });
    }
    setSubmitting(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Create New Request for Proposal
              </h1>
              <button
                onClick={() => setShowAIDialog(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
              >
                <Sparkles className="w-5 h-5" />
                Generate with AI
              </button>
            </div>

            {message && (
              <div
                className={`p-4 mb-6 rounded-lg border ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : message.type === "info"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            <div>
              <Field
                label="RFP Subject"
                name="subject"
                value={form.subject}
                onChange={(v) => updateField("subject", v)}
                placeholder="Enter the subject of your RFP"
                errors={errors}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field
                  label="Budget (₹)"
                  type="number"
                  name="budget"
                  value={form.budget}
                  onChange={(v) => updateField("budget", v)}
                  placeholder="0"
                  errors={errors}
                />
                <Field
                  label="Delivery Date"
                  type="date"
                  name="delivery"
                  value={form.delivery}
                  onChange={(v) => updateField("delivery", v)}
                  errors={errors}
                />
              </div>

              <Field
                label="Billing Address"
                name="billingAddress"
                value={form.billingAddress}
                onChange={(v) => updateField("billingAddress", v)}
                placeholder="Enter billing address"
                errors={errors}
              />

              <div className="flex justify-between items-center mt-8 mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" /> Vendors
                </h2>
                <button
                  onClick={addVendor}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-semibold text-sm"
                >
                  <Plus className="w-4 h-4" /> Add Vendor
                </button>
              </div>

              {form.vendors.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No vendors added yet</p>
                </div>
              )}

              {form.vendors.map((v, i) => (
                <div
                  key={i}
                  className="p-4 bg-gray-50 border border-gray-200 rounded-lg mt-3 flex gap-4 items-center hover:shadow-md transition-shadow"
                >
                  <select
                    value={v.vendor}
                    onChange={(e) => updateVendor(i, "vendor", e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select Vendor</option>
                    {vendorList.map((vn) => (
                      <option key={vn._id} value={vn._id}>
                        {vn.vendorName}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => removeVendor(i)}
                    className="p-2.5 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <X className="text-red-600 w-5 h-5" />
                  </button>
                </div>
              ))}

              <div className="flex justify-between items-center mt-10 mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Package className="w-5 h-5 text-indigo-600" /> Line Items
                </h2>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-semibold text-sm"
                  onClick={addLineItem}
                >
                  <Plus className="w-4 h-4" /> Add Item
                </button>
              </div>

              {form.lineItem.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 mb-4">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No line items added yet</p>
                </div>
              )}

              {form.lineItem.map((it, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg mb-3 hover:shadow-md transition-shadow"
                >
                  <div className="md:col-span-3">
                    <Field
                      label="Item Name"
                      placeholder="e.g. Laptop"
                      value={it.name}
                      onChange={(v) => updateLineItem(i, "name", v)}
                      errors={errors}
                    />
                  </div>

                  <div className="md:col-span-4">
                    <Field
                      label="Description"
                      placeholder="e.g. 16GB RAM, 512GB SSD"
                      value={it.description}
                      onChange={(v) => updateLineItem(i, "description", v)}
                      errors={errors}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Field
                      type="number"
                      label="Quantity"
                      placeholder="0"
                      value={it.quantity}
                      onChange={(v) => updateLineItem(i, "quantity", v)}
                      errors={errors}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Field
                      label="Unit Price (₹)"
                      type="number"
                      placeholder="0"
                      value={it.unitPrice}
                      onChange={(v) => updateLineItem(i, "unitPrice", v)}
                      errors={errors}
                    />
                  </div>

                  <div className="md:col-span-1 flex items-end pb-4">
                    <button
                      onClick={() => removeLineItem(i)}
                      className="w-full p-2.5 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <X className="text-red-600 w-5 h-5 mx-auto" />
                    </button>
                  </div>
                </div>
              ))}

              <Field
                label="Remark"
                name="remark"
                value={form.remark}
                onChange={(v) => updateField("remark", v)}
                placeholder="Additional notes or requirements"
                errors={errors}
              />

              <div className="flex flex-col md:flex-row gap-4 mt-8">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                >
                  {submitting ? "Creating..." : "Create RFP"}
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AIDialog
        isOpen={showAIDialog}
        onClose={() => setShowAIDialog(false)}
        onSubmit={handleAISubmit}
        isProcessing={aiProcessing}
      />

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}