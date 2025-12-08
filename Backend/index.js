import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose, { Mongoose } from "mongoose";
import connectDb from "./db/connectDb.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))

app.use(express.json({
    limit:"32kb"
}));

app.use(express.urlencoded({
    extended:true
}))

app.use(express.static("public"))

app.use(cookieParser())




//Routes!!!!!!!!! Yeah!!!!!!

import vendorRoutes from "./routes/vendor.routes.js"
import quoteRoutes from "./routes/quote.route.js"
import rfpRoutes from "./routes/rfp.routes.js"
import aiRoutes from "./routes/ai.routes.js"
import emailRoutes from "./routes/email.route.js"



app.use("/api/v1/vendor",vendorRoutes)
app.use("/api/v1/quote", quoteRoutes)
app.use("/api/v1/rfp", rfpRoutes)
app.use("/api/v1/ai", aiRoutes)
app.use("/api/v1/email", emailRoutes)


///////Finally the last step
//to fetch the response from the vendor
// import "./services/cron/responseReader.cron.js"


connectDb()
.then(()=>{
    app.listen(process.env.PORT||8000,()=>{
        console.log("Server is up and ready!!!!!")
        console.log(`server listinnig on ${process.env.PORT||8000}`)
    })
})
.catch((err)=>{
    console.log("Mongo Error:->",err)
})