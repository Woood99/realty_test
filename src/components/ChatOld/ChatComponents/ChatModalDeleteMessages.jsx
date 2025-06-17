import React, { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../../../context';
import { sendPostRequest } from '../../../api/requestsApi';
import Checkbox from '../../../uiForm/Checkbox';
import Modal from '../../../ui/Modal';
import ModalWrapper from '../../../ui/Modal/ModalWrapper';

const ChatModalDeleteMessages = ({ deleteMessagesModal, setDeleteMessagesModal }) => {
   const { setMessages, getDialogs, setDialogs, refactDialog } = useContext(ChatContext);

   const [deleteAll, setDeleteAll] = useState(false);

   useEffect(() => {
      setDeleteAll(false);
   }, [deleteMessagesModal]);

   const onHandlerDelete = () => {
      setMessages(prev => refactDialog(prev, deleteMessagesModal.ids));
      onHandlerCancel();
      sendPostRequest('/api/messages/delete-message', {
         ids: deleteMessagesModal.ids,
         dialog_id: deleteMessagesModal.dialog_id,
         flag: !deleteAll ? 1 : 2,
      }).then(() => {
         getDialogs().then(res => {
            setDialogs(res);
         });
      });
   };

   const onHandlerCancel = () => {
      setDeleteMessagesModal(false);
   };

   return (
      <ModalWrapper condition={deleteMessagesModal}>
         <Modal
            condition={Boolean(deleteMessagesModal)}
            set={setDeleteMessagesModal}
            options={{ overlayClassNames: '_center-max-content', modalClassNames: '!w-[400px]', modalContentClassNames: '!pt-8 !px-8' }}>
            {deleteMessagesModal && (
               <div>
                  <h3 className="title-3">
                     {deleteMessagesModal.ids.length === 1
                        ? 'Удалить это сообщение?'
                        : `Удалить ${declensionWordsMessage(deleteMessagesModal.ids.length)}?`}
                  </h3>
                  {deleteMessagesModal.all ? (
                     <Checkbox
                        className="mt-4"
                        checked={deleteAll}
                        onChange={event => setDeleteAll(event.target.checked)}
                        option={{
                           value: 'delete-all',
                           label: 'Удалить для всех',
                        }}
                     />
                  ) : (
                     ''
                  )}
                  <div className="mt-8 flex justify-end gap-4">
                     <button className="blue-link text-defaultMax" onClick={onHandlerCancel}>
                        Отмена
                     </button>
                     <button className="blue-link text-defaultMax" onClick={onHandlerDelete}>
                        Удалить
                     </button>
                  </div>
               </div>
            )}
         </Modal>
      </ModalWrapper>
   );
};

export default ChatModalDeleteMessages;
