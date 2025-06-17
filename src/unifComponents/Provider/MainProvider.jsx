import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { checkAuthUser, getHelpSliceSelector } from '../../redux/helpers/selectors';
import { setSelectAccLogModalOpen, toggleNotificationCall } from '../../redux/slices/helpSlice';
import { NotificationTimer } from '../../ui/Tooltip';
import SelectAccLogModal from '../../ModalsMain/SelectAccLogModal';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import ChatModal from '../../ModalsMain/ChatModal';
import CookieBlock from '../../components/CookieBlock';
import { AuthRoutesPath } from '../../constants/RoutesPath';
import Button from '../../uiForm/Button';
import { sendPostRequest } from '../../api/requestsApi';
import { useMainProvider } from './useMainProvider';

const MainProvider = () => {
   const { notificationCall, selectAccLogModalOpen } = useSelector(getHelpSliceSelector);
   useMainProvider();

   const [isOpenChat, setIsOpenChat] = useState(false);
   const authUser = useSelector(checkAuthUser);
   const navigate = useNavigate();
   const dispatch = useDispatch();

   return (
      <div>
         {notificationCall &&
            createPortal(
               <NotificationTimer
                  time={1000 * 30}
                  show={notificationCall}
                  onClose={() => {
                     dispatch(toggleNotificationCall(false));
                  }}
                  classListRoot="min-w-[300px]">
                  <h3 className="title-3 !text-white mt-2">Вам звонит ...</h3>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                     <Button
                        size="Small"
                        variant="red"
                        onClick={() => {
                           sendPostRequest('/api/video/cancel-call', {
                              user_to_cancel: notificationCall.userToCall,
                              dialog_id: notificationCall.dialog_id,
                           }).then(() => {
                              dispatch(toggleNotificationCall(false));
                           });
                        }}>
                        Отменить
                     </Button>
                     <Button
                        size="Small"
                        onClick={() => {
                           // setIsOpenChat(true);
                           toggleNotificationCall(false);
                           navigate(AuthRoutesPath.chat, { state: { notificationCall } });
                        }}>
                        Подробнее
                     </Button>
                  </div>
               </NotificationTimer>,
               document.getElementById('overlay-wrapper')
            )}

         {!authUser && (
            <SelectAccLogModal
               condition={selectAccLogModalOpen}
               set={value => {
                  dispatch(setSelectAccLogModalOpen(value));
               }}
            />
         )}
         <ModalWrapper condition={isOpenChat}>
            <ChatModal condition={isOpenChat} set={setIsOpenChat} defaultDialogId={notificationCall.dialog_id} videoCallData={notificationCall} />
         </ModalWrapper>
         <CookieBlock />
      </div>
   );
};

export default MainProvider;
