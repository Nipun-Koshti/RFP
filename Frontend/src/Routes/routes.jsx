import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import MainLayout from "../Outlets/MainLayout";

import{Home,Rfp,RfpView,Vendor,VendorView,VendorCreate,NotFound,Quote,RfpCreate} from "../Pages/index"



const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<MainLayout/>}>
            <Route index element={<Rfp/>}/>
            <Route path=":id" element={<RfpView/>}/>
            <Route path="create" element={<RfpCreate/>}/>
            <Route path="vendor">
                <Route index element={<Vendor/>}/>
                <Route path="create" element={<VendorCreate/>}/>
                <Route path=":id" element={<VendorView/>}/>
            </Route>
            <Route path="quote/:id" element={<Quote/>}/>
            <Route path="*" element={<NotFound/>}/>
        </Route>
    )
)

export default router