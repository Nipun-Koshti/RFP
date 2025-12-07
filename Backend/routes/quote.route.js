import { Router } from "express"
import{
    createQuote,
    updateQuote,
    deleteQuote,
    getByIdQuote,
} from "../Controller/quote.controller.js"



const router = Router()

router.route("/create").post(createQuote);
router.route("/update/:id").put(updateQuote);
router.route("/delete/:id").delete(deleteQuote);
router.route("/view/:id").get(getByIdQuote)


export default router