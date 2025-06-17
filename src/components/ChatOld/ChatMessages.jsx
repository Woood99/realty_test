import React, { useContext, useEffect, useState } from 'react';
import { ChatContext, ChatMessagesContext } from '../../context';
import SimpleScrollbar from '../../ui/Scrollbar';

import styles from './Chat.module.scss';
import Avatar from '../../ui/Avatar';
import ChatBottom from './ChatBottom';

import { capitalizeWords } from '../../helpers/changeString';
import dayjs from 'dayjs';

import getImagesObj from '../../unifComponents/getImagesObj';
import { useDropzone } from 'react-dropzone';
import ChatMessage from './ChatComponents/ChatMessage';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import Modal from '../../ui/Modal';
import { IconArrowY } from '../../ui/Icons';

const ChatMessages = ({ isOrganization, currentDialogCompanion }) => {
   const { messages, currentDialog, isLoadingDialog, mainBlockBar, filesUpload, setFilesUpload, isVisibleBtnArrow, setIsVisibleBtnArrow } =
      useContext(ChatContext);

   const [filesLimitModal, setFilesLimitModal] = useState(false);
   const [activeAudio, setActiveAudio] = useState(null);

   const handlePlayAudio = audioElement => {
      if (activeAudio && activeAudio !== audioElement) {
         activeAudio.pause();
         activeAudio.currentTime = 0;
      }
      setActiveAudio(audioElement);
   };

   const handleStopAudio = () => {
      if (activeAudio) {
         activeAudio.pause();
         activeAudio.currentTime = 0;
         setActiveAudio(null);
      }
   };

   const addFile = data => {
      const newData = [...filesUpload, ...data];
      const photosData = getImagesObj(
         newData.filter(item => {
            return (item.type || item.file.type).startsWith('image');
         })
      ).map(item => ({
         ...item,
         type: 'image',
      }));

      const videoData = newData
         .filter(item => {
            return item.type.startsWith('video');
         })
         .map(item => ({
            file: item.file || item,
            type: 'video',
         }));

      const resData = [...photosData, ...videoData];
      if (resData.length > 10) {
         setFilesLimitModal(resData.length);
      } else {
         setFilesUpload(resData);
      }
   };

   const deleteFile = idImage => {
      const newData = filesUpload
         .filter(item => item.id !== idImage)
         .map((item, index) => {
            return { ...item, id: index + 1 };
         });

      setFilesUpload(newData);
   };

   const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
      onDrop: addFile,
      multiple: true,
      noClick: true,
      accept: {
         'image/jpeg': ['.jpeg', '.png', '.jpg'],
         'video/mp4': ['.mp4'],
         'video/webm': ['.webm'],
         'video/quicktime': ['.mov'],
      },
   });

   useEffect(() => {
      const scrollableElement = mainBlockBar.current;

      const handleScroll = event => {
         const scrollElement = event.target;
         const scrollTop = scrollElement.scrollTop;
         const scrollHeight = scrollElement.scrollHeight;
         const clientHeight = scrollElement.clientHeight;
         const remainingScroll = scrollHeight - clientHeight - scrollTop;
         if (remainingScroll > 200) {
            setIsVisibleBtnArrow(true);
         } else {
            setIsVisibleBtnArrow(false);
         }
      };

      if (scrollableElement) {
         scrollableElement.addEventListener('scroll', handleScroll);
      }

      return () => {
         if (scrollableElement) {
            scrollableElement.removeEventListener('scroll', handleScroll);
         }
      };
   }, []);

   return (
      <ChatMessagesContext.Provider
         value={{
            getInputProps,
            filesUpload,
            setFilesUpload,
            deleteFile,
            uploadFileOpen: open,
            handlePlayAudio,
            handleStopAudio,
            addFile,
         }}>
         <SimpleScrollbar className={`pr-2 w-full ${styles.ChatMessages}`} ref={mainBlockBar} variant="custom">
            <div className={`${styles.ChatMessagesInner} ${isLoadingDialog ? 'opacity-0' : ''}`}>
               {messages.length === 0 ? (
                  <div className="white-block w-max mx-auto mt-8">
                     <div className="flex flex-col items-center">
                        <Avatar size={90} src={currentDialogCompanion.image} title={currentDialogCompanion.name} />
                        <h3 className="title-3 mt-4">
                           {isOrganization
                              ? currentDialogCompanion.name
                              : capitalizeWords(currentDialogCompanion.name, currentDialogCompanion.surname)}
                        </h3>
                        <div className="mt-4 text-center text-primary400">
                           <p>Здесь пока ничего нет...</p>
                           <p>Отправьте первое сообщение</p>
                        </div>
                     </div>
                  </div>
               ) : (
                  messages.map(item => {
                     return (
                        <div key={item.date}>
                           <div className={styles.ChatDate}>{dayjs(item.date).format('D MMMM')}</div>
                           {/* {item.messages.map(item => {
                              return <ChatMessage data={item} key={item.id} />;
                           })} */}
                        </div>
                     );
                  })
               )}
            </div>
         </SimpleScrollbar>
         <div id="chat-mobile-actions" />
         <div className={styles.ChatBtnArrowContainer}>
            <button
               type="button"
               className={`${styles.ChatBtnArrow} ${isVisibleBtnArrow ? styles.ChatBtnArrowActive : ''}`}
               onClick={() => {
                  if (mainBlockBar.current) {
                     mainBlockBar.current.scrollTop = mainBlockBar.current.scrollHeight;
                  }
               }}>
               <IconArrowY className="fill-white" width={32} height={32} />
            </button>
         </div>
         <div className="py-4 mt-auto mr-2 mx-4">
            <ChatBottom />
         </div>
         <div id="chat-mobile-smile" />
         <ModalWrapper condition={filesLimitModal}>
            <Modal
               condition={Boolean(filesLimitModal)}
               set={setFilesLimitModal}
               options={{ overlayClassNames: '_center-max-content', modalClassNames: '!w-[400px]', modalContentClassNames: '!pt-8 !px-8' }}>
               <h3 className="title-3 mb-1">Произошла ошибка</h3>
               <p>Вы загрузили больше 10 файлов ({filesLimitModal})</p>
            </Modal>
         </ModalWrapper>
      </ChatMessagesContext.Provider>
   );
};

export default ChatMessages;
