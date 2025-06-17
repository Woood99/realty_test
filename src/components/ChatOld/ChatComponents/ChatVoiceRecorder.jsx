import React, { useState, useRef, useContext } from 'react';
import styles from '../Chat.module.scss';
import ModalWrapper from '../../../ui/Modal/ModalWrapper';
import Modal from '../../../ui/Modal';
import { IconMicrophone, IconSend } from '../../../ui/Icons';
import { ChatContext } from '../../../context';
import { formatTimeRecording, saveRecording, startRecording, stopRecording } from './actionsRecording';
import cn from 'classnames'

const ChatVoiceRecorder = () => {
   const { sendVoiceRecorder, isVoiceRecording, setIsVoiceRecording,variantChat } = useContext(ChatContext);
   const [error, setError] = useState('');

   const mediaRecorderRef = useRef(null);
   const [time, setTime] = useState(0);
   const timerRef = useRef(null);

   return (
      <>
         <div className={isVoiceRecording ? styles.ChatBottom : ''}>
            {!isVoiceRecording ? (
               <button
                  className={styles.ChatBtnBlue}
                  onClick={() => startRecording(mediaRecorderRef, setIsVoiceRecording, setError, timerRef, setTime, sendVoiceRecorder)}>
                  <IconMicrophone width={24} height={24} className="stroke-white" />
               </button>
            ) : (
               <div className="h-8 flex justify-between items-center w-full">
                  <div className="flex items-center gap-2 min-w-[72px]">
                     <div className={styles.ChatBlinkCircle} />
                     {formatTimeRecording(time)}
                  </div>
                  <button
                     className="text-blue font-medium text-defaultMax"
                     onClick={() => stopRecording(mediaRecorderRef, setIsVoiceRecording, timerRef)}>
                     Отмена
                  </button>
               </div>
            )}
         </div>
         {isVoiceRecording && (
            <button className={styles.ChatBtnBlue} onClick={() => saveRecording(mediaRecorderRef, setIsVoiceRecording, timerRef)}>
               <IconSend width={24} height={24} className="fill-white" />
            </button>
         )}


         <ModalWrapper condition={error}>
            <Modal
               condition={Boolean(error)}
               set={setError}
               options={{ overlayClassNames: '_center-max-content', modalClassNames: '!w-[400px]', modalContentClassNames: '!pt-[50px]' }}>
               <div className="text-center">
                  <h2 className="title-3">{error.title}</h2>
                  <p className="mt-1">{error.descr}</p>
               </div>
            </Modal>
         </ModalWrapper>
      </>
   );
};

export default ChatVoiceRecorder;
