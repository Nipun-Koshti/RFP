import api from "./axios.api"

const createRfp = async(payload)=>{
    let data;
    try {
        const rfp = await api.post("rfp/create",payload)
        console.log("-------api---------")
        console.log("this is the data that is returened",rfp)
        data = rfp.data?.data
    } catch (error) {
        console.log(error)
    }

    return data;

}

const updateRfp = async(payload,id)=>{
    try {
        const rfp = await api.put(`rfp/update/${id}`,payload)
        console.log(rfp)
    } catch (error) {
        console.log(error)
    }
}

const deleteRfp =async(id)=>{
    try {
        const rfp = await api.delete(`rfp/delete/${id}`)
        console.log(rfp)
    } catch (error) {
        console.log(error)
    }
}

const listRfp =async()=>{
    let value = [];
    try {
        const rfp = await api.get("rfp/list")
        console.log(rfp)
        
        value = rfp.data?.data
        
    } catch (error) {
        console.log(error)
    }

    return value
}

const getOneRfp =async(id)=>{
    let value = [];
    try {
        const rfp = await api.get(`rfp/view/${id}`)
        
        console.log(`rfp/view/${id}`)
        
        value = rfp.data?.data
        
    } catch (error) {
        console.log(error)
    }

    return value
}


export{
    createRfp,
    updateRfp,
    deleteRfp,
    listRfp,
    getOneRfp
}