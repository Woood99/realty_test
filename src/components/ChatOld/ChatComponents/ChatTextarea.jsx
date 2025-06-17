import React, { useContext, useEffect } from 'react';
import styles from './../Chat.module.scss';
import { ChatContext, ChatMessagesContext } from '../../../context';
import { useSelector } from 'react-redux';
import { getIsDesktop } from '../../../redux/helpers/selectors';

const ChatTextarea = () => {
   const { textareaRef, chatRootRef, chatBottomRef, sendMessage, isEdit, setIsEdit, messageText, setMessageText, setIsOpenSmileMenu, setIsOpenMenu } =
      useContext(ChatContext);
   const { filesUpload } = useContext(ChatMessagesContext);

   const isDesktop = useSelector(getIsDesktop);

   const adjustTextareaHeight = textarea => {
      textarea.style.height = '1em';
      textarea.style.height = textarea.scrollHeight + 'px';
      if (chatBottomRef.current && chatBottomRef.current.parentNode && chatRootRef.current) {
         chatRootRef.current.style.setProperty('--chat-bottom-height', `${chatBottomRef.current.parentNode.scrollHeight}px`);
      }

      if (textarea.scrollHeight > 125) {
         textarea.style.overflowY = 'auto';
      } else {
         textarea.style.overflowY = 'hidden';
      }

      chatRootRef.current.style.setProperty('--viewportHeight', `${window.visualViewport.height}px`);
   };

   const onChangeHandler = e => {
      setMessageText(e.target.value);
      adjustTextareaHeight(e.target);
   };

   useEffect(() => {
      if (textareaRef.current) {
         adjustTextareaHeight(textareaRef.current);
      }
   }, [isEdit, filesUpload, messageText]);

   useEffect(() => {
      const handleResize = () => {
         chatRootRef.current.style.setProperty('--viewportHeight', `${window.visualViewport.height}px`);
      };
      handleResize();

      window.addEventListener('resize', handleResize);

      return () => {
         window.removeEventListener('resize', handleResize);
      };
   }, []);

   return (
      <textarea
         maxLength={2000}
         ref={textareaRef}
         className={styles.ChatTextarea}
         value={isEdit ? isEdit.text : messageText}
         onChange={e => {
            if (isEdit) {
               setIsEdit(prev => ({
                  ...prev,
                  text: e.target.value,
               }));
            } else {
               onChangeHandler(e);
            }
         }}
         onFocus={() => {
            setIsOpenSmileMenu(false);
            setIsOpenMenu(false);
         }}
         onKeyDown={event => {
            if (event.key === 'Enter' && !event.shiftKey){
               event.preventDefault();
               if (messageText.trim()!==''){
                  sendMessage();
               }
            }
         }}
         placeholder={`${isDesktop ? 'Введите сообщение' : 'Сообщение'}`}
      />
   );
};

export default ChatTextarea;
