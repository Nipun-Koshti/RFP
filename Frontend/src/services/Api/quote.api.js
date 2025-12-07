import api from "./axios.api"



const createQuote = async(payload)=>{
     try {
        const rfp = await api.post("quote/create",payload)
        console.log(rfp)
    } catch (error) {
        console.log(error)
    }
}

const updateQuote = async(payload,id)=>{
    let data = []
     try {
        const rfp = await api.put(`quote/update/${id}`,payload)

        console.log("-------api------call-----",rfp)
        data = rfp.data?.data
    } catch (error) {
        console.log(error)
    }
    return data
}

const deleteQuote =async(id)=>{
     try {
            const rfp = await api.delete(`quote/update/${id}`)
            console.log(rfp)
        } catch (error) {
            console.log(error)
        }
}

// const listQuote =async(paylaod)=>{
//      try {
//         const rfp = await api.post("rfp/create",payload)
//         console.log(rfp)
//     } catch (error) {
//         console.log(error)
//     }
// }

const getOneQuote =async(id)=>{
    let data =[]
     try {
        const rfp = await api.get(`quote/view/${id}`)
        console.log("---apiCall-----",rfp)
        data = rfp.data?.data
    } catch (error) {
        console.log(error)
    }

    return data
}

export {
    createQuote,
    updateQuote,
    deleteQuote,
    getOneQuote

}
