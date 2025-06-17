import React, { useEffect, useState } from 'react';
import Chat from '../../components/Chat';
import { Helmet } from 'react-helmet';
import MainLayout from '../../layouts/MainLayout';
import { useQueryParams } from '../../hooks/useQueryParams';
import { useLocation, useNavigate } from 'react-router-dom';

const ChatPage = () => {
   const params = useQueryParams();
   const location = useLocation();
   const navigate = useNavigate();

   const [notificationCallData, setNotificationCallData] = useState(null);
   const notificationCallDataState = location.state?.notificationCall;

   useEffect(() => {
      if (notificationCallDataState) {
         setNotificationCallData(notificationCallDataState);
         navigate(location.pathname, { replace: true, state: {} });
      }
   }, [notificationCallDataState]);

   return (
      <MainLayout
         helmet={
            <Helmet>
               <title>Чат</title>
               <meta name="description" content="Добро пожаловать на сайт inrut.ru" />;
               <meta name="description" content="На inrut.ru вы можете решить любой вопрос с недвижимостью" />;
            </Helmet>
         }>
         <main className="main !p-0">
            <Chat
               defaultDialogId={notificationCallData ? +notificationCallData.dialog_id : +params.dialog || null}
               tag={params.tag || null}
               videoCallData={notificationCallData || null}
            />
         </main>
      </MainLayout>
   );
};

export default ChatPage;
