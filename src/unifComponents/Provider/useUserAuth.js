import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import { useDispatch, useSelector } from 'react-redux';
import { setLikes, setUserInfo } from '../../redux/slices/mainInfoSlice';
import { getDataRequest } from '../../api/requestsApi';
import { useCookies } from 'react-cookie';
import { toggleNotificationCall } from '../../redux/slices/helpSlice';
import Echo from 'laravel-echo';
import { ROLES } from '../../constants/roles';
import { AuthRoutesPath } from '../../constants/RoutesPath';
import { useLocation } from 'react-router-dom';
import { getIsDesktop } from '../../redux/helpers/selectors';
import { toast } from 'react-toastify';
import ToastChat from '../../components/Toasts/ToastChat';

export const useUserAuth = () => {
   const dispatch = useDispatch();
   const [cookies, , removeCookie] = useCookies();
   const location = useLocation();

   const isDesktop = useSelector(getIsDesktop);

   const setAuthUser = async () => {
      const userInfo = await getAuthUser();

      const currentRole = ROLES.find(el => el.id === userInfo?.role);

      const user = {
         ...userInfo,
         role: currentRole,
      };

      dispatch(setUserInfo(user));

      getDataRequest('/api/likes').then(res => {
         dispatch(setLikes(res.data));
      });
      return user;
   };

   const userConnectionEcho = userInfo => {
      if (isEmptyArrObj(userInfo)) return;
      const token = cookies.access_token;
      if (!token) return;

      window.Echo = new Echo({
         broadcaster: 'socket.io',
         host: 'https://api.inrut.ru:6001',
         path: '/socket.io',
         auth: {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         },
      });

      const channelDialog = window.Echo.join(`user-video-dialogs.${userInfo.id}`);
      channelDialog.stopListening('UserVideoDialogsEvent');
      channelDialog.listen('UserVideoDialogsEvent', ({ data }) => {
         if (data.type === 'incomingCall') {
            dispatch(toggleNotificationCall(data));
         }
         if (data.type === 'callCanceled') {
            dispatch(toggleNotificationCall(false));
         }
      });

      // const channelLastSeen = window.Echo.join(`user-last-seen.${userInfo.id}`);
      // channelLastSeen.stopListening('UserLastSeenEvent');
      // channelLastSeen.listen('UserLastSeenEvent', ({ data }) => {
      //    console.log(data);
      // });

      const chatMessageNotifications = window.Echo.join(`user-message-notifications.${userInfo.id}`);
      chatMessageNotifications.stopListening('UserMessageNotificationsEvent');
      chatMessageNotifications.listen('UserMessageNotificationsEvent', ({ data }) => {
         if (location.pathname !== AuthRoutesPath.chat) {
            const children = document.querySelector('#chat-notifications .Toastify__toast-container')?.children;
            if (!children || (children?.length < 5 && isDesktop)) {
               // обновление непрочитанных сообщений
               // getAuthUser();
               toast(ToastChat, {
                  data,
                  autoClose: 10000,
                  hideProgressBar: true,
                  position: 'bottom-right',
                  containerId: 'chat-notifications',
                  style: {
                     marginBottom: 10,
                     maxHeight: 81,
                  },
                  onClick: () => {
                     toast.dismiss({ containerId: 'chat-notifications' });
                  },
               });
            }
         }
      });
   };

   const getAuthUser = async () => {
      try {
         const user = await getDataRequest('/api/get-authenticated-user');
         const userResult = user.data.result;
         const data = {
            ...userResult,
            phone: userResult.phone && userResult.phone[0] === '7' ? `+${userResult.phone}` : userResult.phone,
            cities: userResult.cities || [],
            counts: user.data.counts,
         };

         return data;
      } catch (error) {
         removeCookie('loggedIn', { path: '/' });
         removeCookie('access_token', { path: '/' });
         dispatch(setUserInfo({}));
         dispatch(setLikes([]));
      }
   };

   return { setAuthUser, userConnectionEcho, getAuthUser };
};
