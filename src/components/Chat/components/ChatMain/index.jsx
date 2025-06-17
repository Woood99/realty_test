import React, { useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import cn from 'classnames';

import { ChatContext } from '../../../../context';
import { IconArrow, IconLock } from '../../../../ui/Icons';

import styles from '../../Chat.module.scss';
import isEmptyArrObj from '../../../../helpers/isEmptyArrObj';
import { ROLE_ADMIN } from '../../../../constants/roles';
import { getIsDesktop, getUserInfo } from '../../../../redux/helpers/selectors';
import ChatMainUserTop from './ChatMainUserTop';
import ChatMainBuildingTop from './ChatMainBuildingTop';
import { ChatMessages, ChatPinMessagesPanel, ChatPinTop } from '..';
import { CHAT_TYPES } from '../../constants';
import { ChatMessageCommentsPanel } from '../ChatMessages/ui';

const ChatMain = () => {
   const { currentDialog, setCurrentDialog, isLoadingDialog, setIsOpenSmileMenu, setIsOpenMenu, messages, deleteMessages, setCachedDialog } =
      useContext(ChatContext);

   const isDesktop = useSelector(getIsDesktop);
   const [searchParams, setSearchParams] = useSearchParams();

   return (
      <div className={cn(styles.ChatMain, !isDesktop && `${!isEmptyArrObj(currentDialog) ? styles.ChatMainActive : ''}`)}>
         <div className={styles.ChatMainInner}>
            <div className="min-h-16 h-16 px-4 flex items-center border-b border-b-primary800 bg-white">
               {!isDesktop && !isEmptyArrObj(currentDialog) && (
                  <button
                     onClick={() => {
                        setIsOpenSmileMenu(false);
                        setIsOpenMenu(false);
                        setCurrentDialog({});
                        setCachedDialog({});

                        searchParams.delete('dialog');
                        setSearchParams(searchParams);
                     }}
                     className="mr-4">
                     <IconArrow className="rotate-180 fill-dark" width={26} height={26} />
                  </button>
               )}
               <ChatMainUserTop />
            </div>
            <ChatMainBuildingTop />
            <ChatPinTop />
            {!isEmptyArrObj(currentDialog) ? (
               <ChatMessages
                  messages={messages}
                  comments={currentDialog.dialog_type === CHAT_TYPES.CHANNEL}
                  deleteMessage={data => {
                     if (!data) return;
                     deleteMessages(data.ids, data.dialog_id, data.myMessage);
                  }}
               />
            ) : (
               <div className="title-2-5 h-full w-full flex items-center justify-center gap-3">
                  {isLoadingDialog ? (
                     <>
                        <IconLock width={25} height={25} className='fill-dark' />
                        Защищено сквозным шифрованием
                     </>
                  ) : (
                     <>Выберите, кому хотели бы написать</>
                  )}
               </div>
            )}
         </div>
         <ChatPinMessagesPanel />
         <ChatMessageCommentsPanel />
      </div>
   );
};

export default ChatMain;
