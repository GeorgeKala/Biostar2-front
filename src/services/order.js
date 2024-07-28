import axiosInstance from "../Config/axios";

const orderService = {

    fetchEmployeeOrders: async (data) => {
        try{
            const response = axiosInstance.post('/employee-orders', data)
            return response
        }catch(error){
            console.log(error);
            throw error;
        }
    }

}

export default orderService;