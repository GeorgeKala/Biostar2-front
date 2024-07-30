import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAsyncUser } from "../redux/userDataSlice"; 


const useFetchUser = () => {
  const dispatch = useDispatch();
  const { user, loading, error, isAuthenticated } = useSelector(
    (state) => state.user
  );

  useEffect(() => {

    const fetchUserData = async () => {
      dispatch(fetchAsyncUser());
    };


    fetchUserData();
  }, [dispatch]);

  return { user, loading, error, isAuthenticated };
};

export default useFetchUser;
