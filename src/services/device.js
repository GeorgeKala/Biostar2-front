import axiosInstance from "../Config/axios";


  const deviceService = {
    fetchDevices: async () => {
        try {
            const sessionToken = sessionStorage.getItem('sessionToken');
        
            const response = await axiosInstance.get('/devices', {
              headers: {
                'bs-session-id': sessionToken
              }
            });
            if (response.status === 200) {
              return response.data.DeviceCollection.rows; 
            } else {
              throw new Error('Failed to fetch devices');
            }
          } catch (error) {
            console.error('Error fetching devices:', error);
            throw error; 
          }
    },


    scanCard: async (deviceId) => {
        try {
          const sessionToken = sessionStorage.getItem('sessionToken');
      
          const response = await axiosInstance.post(`/devices/${deviceId}/scan_card`, {}, {
            headers: {
              'bs-session-id': sessionToken
            }
          });
      
          if (response.status === 200) {
            return response.data; 
          } else {
            throw new Error('Failed to scan card');
          }
        } catch (error) {
          console.error('Error scanning card:', error);
          throw error; 
        }
      },
  
  };
  
  export default deviceService;