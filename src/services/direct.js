import axiosInstance from "../Config/axios";

const directService = {
    fetchEvents: async (data) => {
        try {
            const sessionToken = sessionStorage.getItem('sessionToken');
        
            const response = await axiosInstance.post('/events/search', data, {
              headers: {
                'bs-session-id': sessionToken
              }
            });
            if (response.status === 200) {
              return response; 
            } else {
              throw new Error('Failed to fetch events');
            }
          } catch (error) {
            console.error('Error fetching events:', error);
            throw error; 
          }
    },

}

export default directService;