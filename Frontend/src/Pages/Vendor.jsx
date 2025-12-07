import React, { useState, useMemo, useEffect } from "react";
import { Plus, Search, SlidersHorizontal, MapPin, Mail, Hash, Calendar } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import { getListVendor } from "../services/Api/vendor.api";

const Vendor = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [vendorList, setVendorList] = useState([]);
  const navigate = useNavigate();

  const tableRowClass =
    "border-b border-gray-100 hover:bg-teal-50/50 transition duration-300 ease-in-out cursor-pointer";
  const buttonBaseClass =
    "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-md transition duration-300 ease-out transform active:scale-98 text-sm";

  // Fetch Vendors on Mount
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const list = await getListVendor();
        setVendorList(list ?? []);
      } catch (error) {
        console.log("Failed to fetch vendors:", error);
      }
    };

    fetchVendors();
  }, []);

  // Filtering Logic
  const filteredVendors = useMemo(() => {
    let list = vendorList;

    // Status filter (placeholders, since your real vendor model has no status)
    if (statusFilter !== "All") {
      list = list.filter((v) => v.status === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      list = list.filter((v) => {
        const matchesName = v.vendorName?.toLowerCase().includes(lower);
        const matchesEmail = v.email?.toLowerCase().includes(lower);
        const matchesCity = v.address?.city?.toLowerCase().includes(lower);
        const matchesState = v.address?.state?.toLowerCase().includes(lower);
        const matchesStreet = v.address?.street?.toLowerCase().includes(lower);
        
        return matchesName || matchesEmail || matchesCity || matchesState || matchesStreet;
      });
    }

    return list;
  }, [searchTerm, statusFilter, vendorList]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 md:p-12 lg:p-16">
      <div className="mx-auto max-w-7xl flex flex-col gap-10">

        {/* Header */}
        <div className="pt-4 pb-2 border-b border-gray-200">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Vendor Management
          </h1>
          <p className="mt-2 text-xl text-gray-500">
            View, track, and manage all suppliers.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            className={`${buttonBaseClass} bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg`}
            onClick={() =>navigate("/vendor/create")}
          >
            <Plus className="w-5 h-5" />
            Add New Vendor 
          </button>
        </div>

        {/* Search + Filter */}
        <div className="flex gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search by Name, Email, or Address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-teal-500 focus:border-teal-500 transition duration-150 shadow-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          <button
            className="flex items-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition duration-150 shadow-sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filter
          </button>
        </div>

        {/* Filter Dropdown */}
        {isFilterOpen && (
          <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-lg flex gap-4 items-center">
            <label className="text-gray-700 font-medium">Status:</label>
            {["All", "Active", "Pending", "Inactive"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 ${
                  statusFilter === status
                    ? "bg-teal-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        )}

        {/* Vendor Table */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Vendor List ({filteredVendors.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                  <th className="p-4"><Hash className="w-4 h-4 inline mr-1" />ID</th>
                  <th className="p-4">Vendor Name</th>
                  <th className="p-4"><Mail className="w-4 h-4 inline mr-1" />Email</th>
                  <th className="p-4"><Calendar className="w-4 h-4 inline mr-1" />Created At</th>
                  <th className="p-4"><MapPin className="w-4 h-4 inline mr-1" />Address</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredVendors.length > 0 ? (
                  filteredVendors.map((v) => (
                    <tr
                      key={v._id}
                      className={tableRowClass}
                      onClick={() => navigate(`/vendor/${v._id}`)}
                    >
                      <td className="p-4 text-sm font-medium text-gray-600">
                        #{v._id.substring(0, 8)}...
                      </td>

                      <td className="p-4">{v.vendorName}</td>

                      <td className="p-4 text-gray-600">{v.email}</td>

                      <td className="p-4 text-gray-700">
                        {v.createdAt
                          ? new Date(v.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>

                      <td className="p-4 text-gray-700">
                        {v.address
                          ? `${v.address.city}, ${v.address.state}`
                          : "N/A"}
                      </td>

                      <td className="p-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/vendor/${v._id}`);
                          }}
                          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-500 text-xs"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500 text-lg">
                      No vendors match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="p-6 text-center text-sm text-gray-400 border-t border-gray-100">
            Showing {filteredVendors.length} of {vendorList.length} total vendors.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vendor;
