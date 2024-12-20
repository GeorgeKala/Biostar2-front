import { configureStore } from "@reduxjs/toolkit";
import userDataReducer from "./userDataSlice";
import groupReducer from "./groupSlice";
import scheduleReducer from "./scheduleSlice";
import employeeReducer from "./employeeSlice";
import buildingReducer from "./buildingSlice";
import userTypeReducer from "./userTypeSlice";
import departmentsReducer from './departmentsSlice';
import commandTypeReducer from './commandTypeSlice';
import holidaysReducer from './holidaySlice';
import forgiveTypesReducer from './forgiveTypeSlice';
import reportReducer from './reportSlice';
import commentReducer from './commentSlice'
import orderReducer from "./orderSlice";

export const store = configureStore({
  reducer: {
    user: userDataReducer,
    groups: groupReducer,
    schedules: scheduleReducer,
    employees: employeeReducer,
    building: buildingReducer,
    userType: userTypeReducer,
    departments: departmentsReducer,
    commandTypes: commandTypeReducer,
    holidays: holidaysReducer,
    forgiveTypes: forgiveTypesReducer,
    reports: reportReducer,
    comments: commentReducer,
    orders: orderReducer
  },
});
