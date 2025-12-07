import api from "./axios.api";

const emailSender = async(payload)=>{
    try{
        const outbound = api.post("/email/outbound",payload)
        console.log("outbound=------------",outbound)
    }
    catch(error){
        console.error("error in sending the mail------", error)
    }
}

export {emailSender}