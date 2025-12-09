import React, { useState, useEffect, useMemo } from "react";
import { listRfp } from "../services/Api/rfp.api.js";
import { useNavigate } from "react-router-dom";
import { Plus, Sparkles, ChevronRight, Search, SlidersHorizontal } from "lucide-react";

const Rfp = () => {
  const navigate = useNavigate();

  const [rfps, setRfps] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  


  useEffect(() => {
    const fetchRfps = async () => {
      try {
        const response = await listRfp(); 
        setRfps(response || []);
        console.log("---------response--------",response)
      } catch (error) {
        console.error("Error fetching RFPs:", error);
      }
    };

    fetchRfps();
  }, []);

 
  const handleRowClick = (id) => {
    navigate(id); 
   
  };



  const tableRowClass =
    "border-b border-gray-100 hover:bg-indigo-50/50 transition duration-300 ease-in-out cursor-pointer";
  const buttonBaseClass =
    "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-md transition duration-300 ease-out transform active:scale-98";

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 md:p-12 lg:p-16">
      <div className="mx-auto max-w-7xl flex flex-col gap-10">
        
        {/* Header */}
        <div className="pt-4 pb-2 border-b border-gray-200">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight animate-fade-in-down">
            Request for Proposal
          </h1>
          <p className="mt-2 text-xl text-gray-500 animate-fade-in-down delay-200">
            Manage, create, and track all your active RFPs.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-down delay-400">
          <button
            className={`${buttonBaseClass} bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg`}
            onClick={() => navigate("/create")}
          >
            <Plus className="w-5 h-5" />
            Create New RFP
          </button>

         
        </div>
        

        {/* Table */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden animate-slide-up delay-600">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Active RFPs ({rfps.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50 text-left text-xs uppercase text-gray-500 tracking-wider">
                  <th className="p-4 font-bold">ID</th>
                  <th className="p-4 font-bold">Subject</th>
                  <th className="p-4 font-bold">Budget</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">Created</th>
                  <th className="p-4 font-bold sr-only">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {rfps.length > 0 ? (
                  rfps.map((rfp) => (
                    <tr
                      key={rfp._id}
                      className={tableRowClass}
                      onClick={() => handleRowClick(rfp._id)}
                    >
                      <td className="p-4 text-sm font-medium text-gray-600">
                        #{rfp._id.substring(0, 8)}...
                      </td>
                      <td className="p-4 text-sm font-medium text-gray-900">
                        {rfp.subject}
                      </td>
                      <td className="p-4 text-sm font-semibold text-green-600">
                        ₹{rfp.budget?.toLocaleString("en-IN")}
                      </td>
                      <td className="p-4 text-sm">
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {rfp.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-700">
                        {new Date(rfp.createdAt).toLocaleDateString()}
                      </td>

                      <td className="p-4 text-sm text-center">
                        <button
                          className="text-indigo-600 hover:text-indigo-800 font-medium transition duration-150 flex items-center gap-1 mx-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(rfp._id);
                          }}
                        >
                          Details <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-gray-500 text-lg">
                      No RFPs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-6 text-center text-sm text-gray-400 border-t border-gray-100">
            Showing {rfps.length} total RFPs.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rfp;
  