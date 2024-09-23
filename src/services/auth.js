import axiosInstance from "../Config/axios";

export const login = async (username, password) => {
  try {
    const response = await axiosInstance.post("/login", { username, password });
    const { data } = response;

    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("sessionToken", data["bs-session-id"]);
    return data;
  } catch (error) {
    throw error.response.data;
  }
};

export const fetchUser = async () => {
  try {
    console.log("Fetching user...");
    const response = await axiosInstance.get("/user");
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};

export const logout = async () => {
  try {
    await axiosInstance.post("/logout");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("sessionToken");
    sessionStorage.removeItem("bs_id_token");
    sessionStorage.removeItem('isAdminLogged'); // Clear the isAdminLogged flag on logout

  } catch (error) {
    console.error("Logout error:", error);
    throw error.response.data;
  }
};

export const reportLogin = async () => {
  const sessionToken = sessionStorage.getItem("sessionToken");

  try {
    const response = await axiosInstance.post(
      "/reports/login",
      {},
      {
        headers: {
          "bs-session-id": sessionToken,
        },
      }
    );
    sessionStorage.setItem("bs_id_token", response.data[0].Value);
    return data;
  } catch (error) {
    throw error.response.data;
  }
};

// New method for changing password
export const changePassword = async (
  currentPassword,
  newPassword,
  newPasswordConfirmation
) => {
  try {
    const response = await axiosInstance.post("/change-password", {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: newPasswordConfirmation,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  };



  

  


  
};
