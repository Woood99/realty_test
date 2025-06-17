import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';

import styles from '../Chat.module.scss';
import { ChatContext } from '../../../context';
import { getIsDesktop } from '../../../redux/helpers/selectors';

const ChatTextarea = ({ options }) => {
   const { textareaTriggers = {}, value = '', onChange = () => {}, onFocus = () => {}, messageText, send = () => {} } = options;
   const { textareaRef, chatRootRef } = useContext(ChatContext);

   const isDesktop = useSelector(getIsDesktop);

   const adjustTextareaHeight = textarea => {
      textarea.style.height = '1em';
      textarea.style.height = textarea.scrollHeight + 'px';

      if (textarea.scrollHeight > 125) {
         textarea.style.overflowY = 'auto';
      } else {
         textarea.style.overflowY = 'hidden';
      }

      chatRootRef.current.style.setProperty('--viewportHeight', `${window.visualViewport.height}px`);
   };

   useEffect(() => {
      if (textareaRef.current) {
         adjustTextareaHeight(textareaRef.current);
      }
   }, [{ ...textareaTriggers }]);

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
         value={value}
         onChange={e => {
            onChange(e);
            adjustTextareaHeight(e.target);
         }}
         onFocus={onFocus}
         onKeyDown={event => {
            if (event.key === 'Enter' && !event.shiftKey) {
               event.preventDefault();
               if (messageText.trim() !== '') {
                  send();
               }
            }
         }}
         placeholder={`${isDesktop ? 'Введите сообщение' : 'Сообщение'}`}
      />
   );
};

export default ChatTextarea;
