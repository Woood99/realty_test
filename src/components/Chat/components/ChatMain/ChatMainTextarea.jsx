import { useContext } from 'react';
import { ChatContext } from '../../../../context';
import ChatTextarea from '../ChatTextarea';

const ChatMainTextarea = () => {
   const { sendMessage, isEdit, setIsEdit, messageText, setMessageText, setIsOpenSmileMenu, setIsOpenMenu, filesUpload } = useContext(ChatContext);

   const options = {
      send: sendMessage,
      messageText,
      value: isEdit ? isEdit.text : messageText,
      onChange: e => {
         if (isEdit) {
            setIsEdit(prev => ({
               ...prev,
               text: e.target.value,
            }));
         } else {
            setMessageText(e.target.value);
         }
      },
      onFocus: () => {
         setIsOpenSmileMenu(false);
         setIsOpenMenu(false);
      },
      textareaTriggers: { isEdit, filesUpload, messageText },
   };

   return <ChatTextarea options={options} />;
};

export default ChatMainTextarea;
