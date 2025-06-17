import { useContext, useEffect, useState } from 'react';
import styles from '../../../Chat.module.scss';
import cn from 'classnames';
import { ChatContext } from '../../../../../context';
import { IconArrow, IconSend } from '../../../../../ui/Icons';
import { declensionComments } from '../../../../../helpers/declensionWords';
import { ChatMessages, ChatSmile } from '../..';
import ChatTextarea from '../../ChatTextarea';

const ChatMessageCommentsPanel = () => {
   const { messageCommentsOptions, getDialog } = useContext(ChatContext);
   const {
      messageComments,
      messageCommentsIsOpen,
      messageCommentPanelClose,
      messageCommentCreate,
      messageCommentDelete,
      messageCommentGetAll,
      messagesLength,
      isLoadingComments,
   } = messageCommentsOptions;

   const [messageText, setMessageText] = useState('');

   const [isActive, setIsActive] = useState(false);

   const sendMessage = async () => {
      try {
         setMessageText('');
         await messageCommentCreate(messageComments.dialog_id, messageComments.message_id, messageText);
         await getDialog(messageComments.dialog_id);
         await messageCommentGetAll(messageComments.dialog_id, messageComments.message_id);
      } catch (error) {}
   };

   useEffect(() => {
      const timer = setTimeout(() => {
         setIsActive(messageCommentsIsOpen);
      }, 20);

      return () => clearTimeout(timer);
   }, [messageCommentsIsOpen]);

   const optionsTextarea = {
      send: sendMessage,
      messageText,
      value: messageText,
      onChange: e => {
         setMessageText(e.target.value);
      },
      onFocus: () => {},
      textareaTriggers: { messageText },
   };

   return (
      <div
         className={cn(
            'bg-white absolute w-full h-full z-[999] top-0 left-0 transition-all duration-300 flex flex-col',
            !messageCommentsIsOpen && 'hidden',
            !isActive && 'left-full invisible'
         )}>
         <div className="min-h-16 h-16 px-4 flex items-center border-b border-b-primary800 bg-white">
            <button type="button" className="flex-center-all" onClick={messageCommentPanelClose}>
               <IconArrow className="rotate-180 fill-primary400" width={32} height={32} />
            </button>
            <div className="ml-4">
               <h3 className="title-3-5">Обсуждение</h3>
               <p className="text-primary400">{declensionComments(messagesLength)}</p>
            </div>
         </div>
         <div className="bg-[#e3efff] flex-grow flex flex-col overflow-hidden">
            {isActive && !isLoadingComments && (
               <>
                  <ChatMessages
                     messages={messageComments.data}
                     variant="pin"
                     comments={false}
                     deleteMessage={async data => {
                        if (!data) return;
                        await messageCommentDelete(data.ids[0], data.dialog_id, data.message_id);
                        await messageCommentGetAll(data.dialog_id, data.message_id);
                        await getDialog(data.dialog_id);
                        console.log('asd');
                     }}
                  />
                  <div className="flex items-center gap-2 mmd1:max-w-[920px] w-full mmd1:mx-auto mb-4">
                     <div className={styles.ChatBottom}>
                        <div className={styles.ChatBottomWrapper}>
                           <ChatSmile
                              setMessageText={value => {
                                 setMessageText(prev => `${prev}${value}`);
                              }}
                           />
                           <ChatTextarea options={optionsTextarea} />
                        </div>
                     </div>
                     <button className={styles.ChatBtnBlue} onClick={sendMessage}>
                        <IconSend width={24} height={24} className="fill-white" />
                     </button>
                  </div>
               </>
            )}
         </div>
      </div>
   );
};

export default ChatMessageCommentsPanel;
