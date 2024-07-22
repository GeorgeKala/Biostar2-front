import axiosInstance from "../Config/axios";

const orderService = {

    fetchEmployeeOrders: async (data) => {
        try{
            const response = axiosInstance.post('/employee-orders', data)
            if(response.status == 200){
                return response.data;
            }else {
                throw new Error('Failed to fetch commented details');
            }
        }catch(error){
            console.log(error);
            throw error;
        }
    }

}

export default orderService;