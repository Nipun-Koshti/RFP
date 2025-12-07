import { ApiError } from "../services/api.error.js";
import asyncHandler from "../services/asyncHandler.service.js";
import { validateVendorPayload } from "../services/validations/vendor.validation.js";
import Vendor from "../model/vendor.model.js";
import { ApiResponse } from "../services/response.js";
import mongoose from "mongoose";

const createVendor = asyncHandler(async (req, res) => {
  const vendor = req.body;

  const { valid, errors } = validateVendorPayload(vendor);

  console.log("YOYOYOYOYOYOYOYOYOYOY these are the error", errors);

  if (!valid) {
    throw new ApiError(400, "Fields are not filled correctly", errors);
  }

  const existing = await Vendor.findOne({
    $or: [{ email: vendor.email }, { phone: vendor.phone }],    
  });
  console.log(existing);

  if (existing) {
    throw new ApiError(409, "Vendor with this email or phone already exists");
  }

  const newVendor = await Vendor.create(vendor);

  return res
    .status(201)
    .json(new ApiResponse(201, newVendor, "Vendor created successfully"));
});

const getByIdVendor = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(404, "id is not present ");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid vendor ID format");
  }

  const vendor = await Vendor.findById(id);

  console.log(vendor);

  return res
    .status(201)
    .json(new ApiResponse(201, vendor, "Vendor retrived successfully"));
});

const vendorList = asyncHandler(async (req, res) => {
  const vendors = await Vendor.find().sort({ createdAt: -1 });

  if (!vendors) {
    throw new ApiError(404, "List not found");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, vendors, "Vendors list retrived successfully"));
});

const vendorsNameOnly = asyncHandler(async (req, res) => {
  const vendors = await Vendor.find().select("_id vendorName").sort({ createdAt: -1 });

  if (!vendors) {
    throw new ApiError(404, "List not found");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, vendors, "Vendors Name list restrived successfully")
    );
});

const updateVendor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid vendor ID format");
  }

  const vendor = await Vendor.findById(id);
  if (!vendor) {
    return next(new ApiError(404, "Vendor Vendor with this ID does not exist found"));
  }

  const updatedVendor = await Vendor.findByIdAndUpdate(id, data, {
    new: true,   
    runValidators: true 
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedVendor, "Vendor updated successfully"));
  
});

const deleteVendor = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const vendor = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ApiError(400, "Invalid vendor ID format")
    }

    const existing = Vendor.findById(id);

    if(!existing){
        throw new ApiError(404,"Vendor with this ID does not exist")
    }

    await Vendor.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, vendor, "Vendor Deleted successfully"));
  
});

export {
  createVendor,
  getByIdVendor,
  vendorList,
  updateVendor,
  deleteVendor,
  vendorsNameOnly,
};
