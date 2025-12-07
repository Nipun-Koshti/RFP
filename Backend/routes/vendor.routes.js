import express, { Router } from "express"
import { createVendor, deleteVendor, getByIdVendor, updateVendor, vendorList, vendorsNameOnly } from "../Controller/vendor.controller.js"

const router = Router()

router.route("/register").post(createVendor);
router.route("/list").get(vendorList);
router.route("/nameList").get(vendorsNameOnly);
router.route("/view/:id").get(getByIdVendor);
router.route("/update/:id").put(updateVendor);
router.route("/delete/:id").delete(deleteVendor);


export default router