
import { fetchBuildings } from '../redux/buildingSlice';
import { useDispatch } from 'react-redux';
import { fetchDepartments, fetchNestedDepartments } from "../redux/departmentsSlice";
import { fetchSchedules } from "../redux/scheduleSlice";
import { useEffect } from 'react';
import { fetchGroups } from '../redux/groupSlice';
import { fetchForgiveTypes } from '../redux/forgiveTypeSlice';

import { fetchUsers } from '../redux/userDataSlice';

const DataProvider = ({ children }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchBuildings());
      dispatch(fetchDepartments());
      dispatch(fetchNestedDepartments());
      dispatch(fetchSchedules());
      dispatch(fetchGroups());
      dispatch(fetchForgiveTypes());
      dispatch(fetchUsers());
    };
    fetchData();
  }, [dispatch]);

  

  return <>{children}</>;
};

export default DataProvider;