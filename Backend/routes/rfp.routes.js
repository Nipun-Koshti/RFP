import { Router } from "express";
import {
    createRfp,
    updateRfp,
    deleteRfp,
    getAllRfps,
    getRfpById
} from "../Controller/rfp.controller.js";


const router = Router()

router.route("/create").post(createRfp)
router.route("/update/:id").put(updateRfp)
router.route("/delete/:id").delete(deleteRfp)
router.route("/list").get(getAllRfps)
router.route("/view/:id").get(getRfpById)


export default router