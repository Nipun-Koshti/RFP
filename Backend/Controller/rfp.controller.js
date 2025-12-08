import { rfpValidator } from "../services/validations/rfp.validation.js";
import asyncHandler from "../services/asyncHandler.service.js";
import RfpModel from "../model/rfp.model.js"
import mongoose from "mongoose";
import { ApiError } from "../services/api.error.js";
import { ApiResponse } from "../services/response.js";

const createRfp = asyncHandler(async (req, res) => {
  const body = req.body;
  
  const parsed = rfpValidator.safeParse(body);
  
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      errors: parsed.error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }
  
  const rfp = await RfpModel.create(parsed.data);

  return res.status(201).json(new ApiResponse(201, rfp, "RFP created successfully"));
});


 const updateRfp = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid RFP ID format");
  }

  const isValid = rfpValidator.safeParse(data);

  if(!isValid){
    throw new ApiError(400, "Input contains some discrepency")
  }

  const updated = await RfpModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    throw new ApiError(404, "RFP not found");
  }

  return res.status(200).json(
    new ApiResponse(200, updated, "RFP updated successfully!")
  );
});

 const deleteRfp = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid RFP ID format");
  }

  const deleted = await RfpModel.findByIdAndDelete(id);

  if (!deleted) {
    throw new ApiError(404, "RFP not found");
  }

  return res.status(200).json(
    new ApiResponse(200, deleted._id, "RFP deleted successfully!")
  );
});

const getRfpById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid RFP ID format");
  }

  const rfp = await RfpModel.findById(id)
    .populate("vendors.vendor", "vendorName email phone")
    .populate("vendors.quotation");

  if (!rfp) {
    throw new ApiError(404, "RFP not found");
  }

  return res.status(200).json(
    new ApiResponse(200, rfp, "RFP retrieved successfully!")
  );
});


const getAllRfps = asyncHandler(async (req, res) => {
  const rfps = await RfpModel.find({})
    .select("subject budget status createdAt billingAddress").sort({createdAt:-1});

  return res.status(200).json(
    new ApiResponse(200, rfps, "All RFPs retrieved successfully!")
  );
});


export {
    createRfp,
    updateRfp,
    deleteRfp,
    getAllRfps,
    getRfpById
}