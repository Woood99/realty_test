import { createSlice } from '@reduxjs/toolkit';

const initialState = {
   initApp: false,
   notification: false,
   notificationLogout: false,
   notificationCall: false,
   selectAccLogModalOpen: false,
};

const helpSlice = createSlice({
   name: 'helpSlice',
   initialState,
   reducers: {
      toggleNotificationLogout(state, action) {
         state.notificationLogout = action.payload;
      },
      toggleNotificationCall(state, action) {
         state.notificationCall = action.payload;
      },
      setInitApp(state, action) {
         state.initApp = action.payload;
      },
      setSelectAccLogModalOpen(state, action) {
         state.selectAccLogModalOpen = action.payload;
      },
   },
});

export const { toggleNotificationLogout, toggleNotificationCall, setInitApp, setSelectAccLogModalOpen } = helpSlice.actions;

export default helpSlice.reducer;
