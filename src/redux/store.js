import { configureStore } from '@reduxjs/toolkit';

import windowSizeSlice from './slicesHelp/windowSizeSlice';

import mainInfoSlice from './slices/mainInfoSlice';
import listingSlice from './slices/listingSlice';
import listingFlatsSlice from './slices/listingFlatsSlice';
import feedSlice from './slices/feedSlice';
import buildingApartSlice from './slices/buildingApartSlice';
import apartmentSlice from './slices/apartmentSlice';
import helpSlice from './slices/helpSlice';

export const store = configureStore({
   reducer: {
      windowSize: windowSizeSlice,
      mainInfo: mainInfoSlice,
      listing: listingSlice,
      buildingApartFilter: buildingApartSlice,
      apartment: apartmentSlice,
      helpSlice: helpSlice,
      listingFlats: listingFlatsSlice,
      feed: feedSlice,
   },
});
