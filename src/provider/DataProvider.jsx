
import useFetchUser from '../hooks/useFetchUser';
import { useDispatch } from 'react-redux';
import { fetchDepartments, fetchNestedDepartments } from "../redux/departmentsSlice";
import { fetchSchedules } from "../redux/scheduleSlice";
import { useEffect } from 'react';
import { fetchGroups } from '../redux/groupSlice';
import { fetchForgiveTypes } from '../redux/forgiveTypeSlice';
import { fetchBuildings } from '../redux/buildingSlice';

const DataProvider = ({ children }) => {
  const dispatch = useDispatch();
  useFetchUser();

  useEffect(() => {
    dispatch(fetchNestedDepartments());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchSchedules());
  },[dispatch])

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchForgiveTypes());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchBuildings());
  }, [dispatch]);

  

  return <>{children}</>;
};

export default DataProvider;