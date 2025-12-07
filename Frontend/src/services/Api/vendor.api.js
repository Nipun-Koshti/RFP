import api from "./axios.api.js"

const registerVendor = async(payload)=>{
    try {
        console.log("----Start-----")
        const data = await api.post("vendor/register",payload)
        console.log(data)
    } catch (error) {
        console.log("Error with registering the vendor---",error)
        throw error
    }
}

const getListVendor = async()=>{
    let value = []
    try {
        const data = await api.get("vendor/list")
        value = data.data?.data
    } catch (error) {
        console.log("Error while retreving the vendor list---",error.response.data.message)

        throw error
    }
    return value
}

const getNameVendor = async()=>{
    let value = []
    try {
        const data = await api.get("vendor/namelist")
        value = data.data?.data
    } catch (error) {
        console.log("Error while retreving the vendor list---",error.response.data.message)

        throw error
    }
    return value
}


const getVendorById = async(id)=>{
    let value = []
    try {
        const data = await api.get(`vendor/view/${id}`)
        console.log(data.data?.data)
        value = data.data?.data
    } catch (error) {
        console.log("Error with registering the vendor---",error.response.data.message)

        throw error
    }
    return value
}

const deleteVendorById = async(id)=>{
    let value = []
    try {
        const data = await api.delete(`vendor/delete/${id}`)
        
    } catch (error) {
        console.log("Error while deleting the vendor---",error.response.data.message)

        throw error
    }
    return value
}

const updateVendorById = async(id,payload)=>{
    let value = []
    try {
        const data = await api.put(`vendor/update/${id}`,payload)
        console.log("----data Updated-------")
    } catch (error) {
        console.log("Error with registering the vendor---",error.response.data.message)

        throw error
    }
    return value
}


export {registerVendor,getListVendor,getVendorById,deleteVendorById,updateVendorById,getNameVendor}