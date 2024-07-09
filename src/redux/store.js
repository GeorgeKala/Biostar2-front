import { configureStore } from "@reduxjs/toolkit";
import userDataReducer from "./userDataSlice";
import groupReducer from "./groupSlice";
import scheduleReducer from "./scheduleSlice";
import employeeReducer from "./employeeSlice";
import buildingReducer from "./buildingSlice";

export const store = configureStore({
  reducer: {
    user: userDataReducer,
    groups: groupReducer,
    schedules: scheduleReducer,
    employees: employeeReducer,
    building: buildingReducer,
  },
});
