import api from "./axios.api";

const getJsonFromFreeText = async(payload)=>{
    let data;
    try {
        data = await api.post("ai/createRFP",payload)

    } catch (error) {
        console.error(error)
        alert("Error occured during the Ai help")
    }
    return data.data.rfp;
}

export {getJsonFromFreeText}