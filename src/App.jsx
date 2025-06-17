import React from 'react';

import Router from './unifComponents/Router';
import MainProvider from './unifComponents/Provider/MainProvider';
import ToastChatContainer from './components/Toasts/ToastChatContainer';

const App = () => {
   return (
      <>
         <Router />
         <MainProvider />
         <ToastChatContainer />
      </>
   );
};

export default App;
