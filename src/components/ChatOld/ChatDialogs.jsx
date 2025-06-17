import React, { memo, useContext } from 'react';
import SimpleScrollbar from '../../ui/Scrollbar';
import styles from './Chat.module.scss';
import { ChatContext } from '../../context';
import UserInfo from '../../ui/UserInfo';
import dayjs from 'dayjs';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import { isToday } from '../../helpers/changeDate';
import { useSelector } from 'react-redux';
import { getUserInfo } from '../../redux/helpers/selectors';
import { ROLE_ADMIN } from '../../constants/roles';
import { useSearchParams } from 'react-router-dom';
import { getShortNameSurname } from '../../helpers/changeString';
import cn from 'classnames';
import RepeatContent from '../RepeatContent';
import WebSkeleton from '../../ui/Skeleton/WebSkeleton';

const ChatDialogButton = ({ data, options }) => {
   const {
      currentDialog,
      setCurrentDialog,
      connectToChat,
      getDialog,
      setIsLoadingDialog,
      setIsVisibleBtnArrow,
      sidebarMini,
      closeSearchPanel,
      userInfo,
      setSearchParams,
   } = options;
   const companions = data.companions;

   if (companions.length === 1) {
      const companion = companions[0];

      return (
         <button
            key={data.id}
            type="button"
            className={`${styles.ChatSidebarDialog} ${currentDialog.id === data.id ? styles.ChatSidebarDialogActive : ''}`}
            onClick={() => {
               if (currentDialog.id !== data.id) {
                  setIsLoadingDialog(true);
                  setCurrentDialog(data);
                  connectToChat(data.id);
                  getDialog(data.id);
                  setSearchParams({ dialog: data.id });
                  setIsVisibleBtnArrow(false);
                  closeSearchPanel();
               }
            }}>
            <UserInfo
               sizeAvatar={54}
               avatar={data.organization && userInfo?.role?.id !== ROLE_ADMIN.id ? data.organization.image : companion.image}
               name={
                  data.organization && userInfo?.role?.id !== ROLE_ADMIN.id
                     ? data.organization.name
                     : getShortNameSurname(companion.name, companion.surname)
               }
               className="w-[calc(100%-50px)]"
               classNameContent={cn('flex-grow', sidebarMini ? '!hidden' : '')}
               posChildren={
                  <div className={cn('flex flex-col mt-1 text-primary400 w-full', sidebarMini ? '!hidden' : '')}>
                     {data.building && (
                        <div className="mb-2 flex">
                           <span className="cut-one">ЖК {data.building.name}</span>
                        </div>
                     )}
                     {data.last_message && !isEmptyArrObj(data.last_message) && (
                        <div className="flex">
                           <span className="cut-one">{data.last_message.text}</span>
                        </div>
                     )}
                  </div>
               }
               centered
            />
            {!sidebarMini && (
               <div className="flex flex-col items-end justify-between gap-1.5">
                  {data.last_message && !isEmptyArrObj(data.last_message) && (
                     <span className="min-w-max">
                        {isToday(data.last_message.updated_at)
                           ? dayjs(data.last_message.updated_at).format('HH:mm')
                           : dayjs(data.last_message.updated_at).format('D MMM')}
                     </span>
                  )}

                  {Boolean(data.un_read_messages_count) && (
                     <div className={`bg-count-circle ${currentDialog.id !== data.id ? '_blue' : '_white'} `}>{data.un_read_messages_count}</div>
                  )}
               </div>
            )}
         </button>
      );
   }
};

const ChatDialogs = memo(({ sidebarMini = false }) => {
   const chatOptions = useContext(ChatContext);
   const { dialogs, isLoadingDialogs, chatSearchDialog } = chatOptions;

   const { closeSearchPanel } = chatSearchDialog;
   const userInfo = useSelector(getUserInfo);
   const [_, setSearchParams] = useSearchParams();

   return (
      <SimpleScrollbar className="overflow-y-auto px-2" variant="custom">
         <div className="flex flex-col gap-1">
            {isLoadingDialogs ? (
               <RepeatContent count={12}>
                  <div className="flex gap-3 items-center py-3 pr-6 pl-3">
                     <WebSkeleton className="w-12 h-12 rounded-full" />
                     <WebSkeleton className="w-[150px] h-6 rounded-lg" />
                  </div>
               </RepeatContent>
            ) : (
               <>
                  {dialogs.map(item => {
                     return (
                        <ChatDialogButton
                           key={item.id}
                           data={item}
                           options={{ ...chatOptions, sidebarMini, closeSearchPanel, userInfo, setSearchParams }}
                        />
                     );
                  })}
               </>
            )}
         </div>
      </SimpleScrollbar>
   );
});

export default ChatDialogs;
