import React, { useContext } from 'react';
import cn from 'classnames';
import { useSelector } from 'react-redux';

import styles from '../../Chat.module.scss';
import { ChatContext, ChatMessageContext, ChatMessagesContext } from '../../../../context';
import { getIsDesktop, getUserInfo } from '../../../../redux/helpers/selectors';
import { ChatMessageReactionPanel } from '..';
import {
   ChatMessageAudio,
   ChatMessageCommentsButton,
   ChatMessagePhotos,
   ChatMessageText,
   ChatMessageTimeAndReads,
   ChatMessageTooltip,
   ChatMessageVideo,
} from './ui';
import { getColorForLetter } from '../../../../ui/Avatar';

const ChatMessage = ({ data, comments = true }) => {
   const {
      currentDialog,
      currentDialogUserInfo,
      setIsEdit,
      setForwardMessageId,
      chatPinMessages,
      getDialog,
      setFilesUpload,
      messageCommentsOptions,
   } = useContext(ChatContext);
   const { deleteMessage, showPopper, setShowPopper } = useContext(ChatMessagesContext);

   const userInfo = useSelector(getUserInfo);
   const isDesktop = useSelector(getIsDesktop);

   const myMessage = data.user.id === userInfo.id;

   const videoData = data.files?.filter(item => item.type === 'video')[0];

   const audioData = data.files?.filter(item => item.type === 'audio')[0];
   const dataText = data.is_json ? JSON.parse(data.text) : data.text;
   const isReactions = Boolean(data.reactions.length);

   const photosLength = data.photos?.length;

   const blockClassName = cn(
      styles.ChatMessageBlock,
      myMessage && styles.ChatMessageBlockMe,
      photosLength && styles.ChatMessageBlockPhotos,
      audioData && styles.ChatMessageBlockAudio,
      videoData && styles.ChatMessageBlockVideo,
      isReactions && styles.ChatMessageBlockReactions
   );

   if (!dataText && !videoData && !audioData && !photosLength) return;

   return (
      <ChatMessageContext.Provider
         value={{
            data,
            myMessage,
            showPopper,
            setShowPopper,
            getDialog,
            userInfo,
            currentDialog,
            currentDialogUserInfo,
            chatPinMessages,
            deleteMessage,
            setIsEdit,
            setForwardMessageId,
            setFilesUpload,
            messageCommentsOptions,
            videoData,
            audioData,
            dataText,
         }}>
         <div
            className={cn(styles.ChatMessage, myMessage && styles.ChatMessageMe, data.loading && styles.ChatMessageLoading)}
            onClick={e => {
               if (isDesktop) return;
               if (data.loading) return;
               if (e.target.closest('.video-player')) return;

               setShowPopper(prev => (prev ? false : data.id));
            }}
            onContextMenu={e => {
               if (!isDesktop) return;
               if (data.loading) return;

               e.preventDefault();
               setShowPopper(prev => (prev ? false : data.id));
            }}>
            <div className={blockClassName}>
               <div className={cn(styles.ChatMessageBlockWrapper)}>
                  {data.user_visible && (
                     <span className={styles.ChatMessageUserName} style={{ color: getColorForLetter(data.user.name) }}>
                        {userInfo.id === data.user.id ? 'Вы' : data.user.name}
                     </span>
                  )}

                  <div className="relative">
                     {Boolean(photosLength || videoData || data.is_json) && (
                        <div className={cn('flex flex-col gap-1', dataText && 'mb-2')}>
                           <ChatMessagePhotos />
                           <ChatMessageVideo />
                           {/* <ChatMessagePersonalDiscount /> */}
                        </div>
                     )}
                     <ChatMessageAudio />
                     <ChatMessageText />

                     <div className={isReactions ? 'mt-1.5 flex items-end justify-between' : 'inline'}>
                        <ChatMessageReactionPanel />
                        <ChatMessageTimeAndReads />
                     </div>
                  </div>
               </div>
               <ChatMessageTooltip />
               {comments && <ChatMessageCommentsButton />}
            </div>
         </div>
      </ChatMessageContext.Provider>
   );
};

export default ChatMessage;
