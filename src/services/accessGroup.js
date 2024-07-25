import axiosInstance from "../Config/axios";

const accessGroupService = {
    fetchAccessGroups: async () => {
        try {
            const sessionToken = sessionStorage.getItem('sessionToken');
        
            const response = await axiosInstance.get('/access-groups', {
                headers: {
                    'bs-session-id': sessionToken
                }
            });

            if (response.status === 200) {
                return response.data; 
            } else {
                throw new Error('Failed to fetch access groups');
            }
        } catch (error) {
            console.error('Error fetching access groups:', error);
            throw error; 
        }
    },
}

export default accessGroupService;
