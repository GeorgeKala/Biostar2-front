import axiosInstance from "../Config/axios";

const commentService = {
    fetchCommentedDetails: async (data) => {
        try {
            const response = await axiosInstance.post('/commented-details', data);
            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error('Failed to fetch commented details');
            }
        } catch (error) {
            console.error('Error fetching commented details:', error);
            throw error;
        }
    }
};

export default commentService