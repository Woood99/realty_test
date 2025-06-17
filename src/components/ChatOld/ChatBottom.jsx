import React, { useCallback, useContext } from 'react';
import styles from './Chat.module.scss';
import { IconCheckedSecond, IconClose, IconEdit, IconSend } from '../../ui/Icons';
import { ChatMessagesContext, ChatContext } from '../../context';
import getSrcImage from '../../helpers/getSrcImage';
import { ThumbPhotoDefault } from '../../ui/ThumbPhoto';
import ChatMenu from './ChatComponents/ChatMenu';
import ChatVoiceRecorder from './ChatComponents/ChatVoiceRecorder';
import ChatTextarea from './ChatComponents/ChatTextarea';
import ChatSmile from './ChatSmile';
import { useSelector } from 'react-redux';
import { getIsDesktop } from '../../redux/helpers/selectors';
import ChatPresent from './ChatPresent';

const ChatBottom = () => {
   const { chatBottomRef, isEdit, setIsEdit, messageText, sendMessage, isVoiceRecording, setMessageText, variantChat } = useContext(ChatContext);
   const { filesUpload, setFilesUpload, deleteFile } = useContext(ChatMessagesContext);

   const isDesktop = useSelector(getIsDesktop);

   const checkForSend = Boolean((((isEdit && isEdit.text?.length) || messageText.length) && !isVoiceRecording) || filesUpload.length);

   const FilesLayout = useCallback(() => {
      if (!filesUpload.length) return;

      return filesUpload.map((item, index) => {
         return (
            <ThumbPhotoDefault style={{ width: 75, height: 75, borderRadius: 8, flex: '0 0 75px', position: 'relative' }} key={index}>
               <button
                  onClick={() => deleteFile(item.id)}
                  className="absolute -right-1 -top-1 bg-dark rounded-full shadow-primary w-6 h-6 flex items-center justify-center pointer-events-auto">
                  <IconClose width={18} height={18} className="fill-white pointer-events-none" />
               </button>
               <img src={getSrcImage(item.image)} />
            </ThumbPhotoDefault>
         );
      });
   }, [filesUpload]);

   const LayoutBody = useCallback(() => {
      return (
         <>
            {isEdit && (
               <div className="py-3 mb-3 flex border-b border-b-primary800">
                  <IconEdit width={22} height={22} className="mr-3 mt-2 stroke-blue stroke-[1.5px] flex-shrink-0" />
                  <div className="w-full">
                     <p className="text-blue mb-1">Редактируемое сообщение</p>
                     {Boolean(filesUpload.length) && (
                        <div className="mt-4 mb-2 py-3 flex items-center gap-3 overflow-x-auto scrollbarPrimary pointer-events-none">
                           <FilesLayout />
                        </div>
                     )}
                     {isEdit.text_old}
                  </div>
                  <button
                     className="ml-auto h-max mt-2"
                     onClick={() => {
                        setIsEdit(false);
                        setFilesUpload([]);
                     }}>
                     <IconClose width={24} height={24} className="fill-primary400" />
                  </button>
               </div>
            )}
            {Boolean(!isEdit && filesUpload.length) && (
               <div className="py-3 mb-3 flex items-center gap-3 border-b border-b-primary800 overflow-x-auto scrollbarPrimary pointer-events-none">
                  <FilesLayout />
               </div>
            )}
         </>
      );
   }, [filesUpload, isEdit]);

   return (
      <div className="flex items-center gap-2 mmd1:max-w-[804px] mmd1:mx-auto" ref={chatBottomRef}>
         {!isVoiceRecording && (
            <>
               {isDesktop && variantChat === 'page' && <ChatMenu />}
               <div className={styles.ChatBottom}>
                  <LayoutBody />
                  <div className={styles.ChatBottomWrapper}>
                     {(!isDesktop || variantChat === 'mini') && <ChatMenu />}
                     <ChatSmile
                        setMessageText={value => {
                           setMessageText(prev => `${prev}${value}`);
                        }}
                     />
                     <ChatTextarea />
                     {/* <ChatPresent /> */}
                  </div>
               </div>
               {checkForSend && (
                  <button className={styles.ChatBtnBlue} onClick={() => sendMessage()}>
                     {isEdit ? <IconCheckedSecond className="fill-white" /> : <IconSend width={24} height={24} className="fill-white" />}
                  </button>
               )}
            </>
         )}
         {Boolean(!isEdit.text?.length && !messageText.length && !filesUpload.length) && <ChatVoiceRecorder />}
      </div>
   );
};

export default ChatBottom;
