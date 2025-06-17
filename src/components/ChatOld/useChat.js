import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { getDataRequest, sendPostRequest } from '../../api/requestsApi';
import { refactPhotoStageAppend, refactPhotoStageOne, refactPhotoStageTwo } from '../../helpers/photosRefact';
import convertFieldsJSON from '../../helpers/convertFieldsJSON';
import { getUserInfo } from '../../redux/helpers/selectors';
import { CHAT_TAGS } from '../../constants/chat-tags';

export const useChat = (defaultDialogId, videoCallData, tag) => {
   const [currentDialog, setCurrentDialog] = useState({});

   const userInfo = useSelector(getUserInfo);

   const [dialogs, setDialogs] = useState([]);
   const [isLoadingDialogs, setIsLoadingDialogs] = useState(true);

   const [messages, setMessages] = useState([]);
   const [filesUpload, setFilesUpload] = useState([]);

   const [messageText, setMessageText] = useState(tag ? CHAT_TAGS.find(item => item.id === +tag)?.text || '' : '');

   const mainBlockBar = useRef(null);

   const [isLoadingDialog, setIsLoadingDialog] = useState(true);

   const chatRootRef = useRef(null);
   const chatBuildingInfoRef = useRef(null);
   const chatBottomRef = useRef(null);
   const textareaRef = useRef(null);

   const [deleteMessagesModal, setDeleteMessagesModal] = useState(false);
   const [isVoiceRecording, setIsVoiceRecording] = useState(false);

   const [isOpenMenu, setIsOpenMenu] = useState(false);
   const [isOpenSmileMenu, setIsOpenSmileMenu] = useState(false);
   const [isVisibleBtnArrow, setIsVisibleBtnArrow] = useState(false);
   const [forwardMessageId, setForwardMessageId] = useState(false);
   const [createEventModal, setCreateEventModal] = useState(false);

   const [isEdit, setIsEdit] = useState(false);

   const [videoCallActive, setVideoCallActive] = useState(Boolean(videoCallData));

   const dialogBuilding = currentDialog.building ? convertFieldsJSON(currentDialog.building) : null;

   const [searchParams, setSearchParams] = useSearchParams();

   const getDialogs = async () => {
      return await getDataRequest('/api/dialogs').then(res => res.data.result);
   };

   useEffect(() => {
      const fetchData = async () => {
         setIsLoadingDialog(true);
         setIsLoadingDialogs(true);
         const dialogsData = await getDialogs();
         setDialogs(dialogsData);
         setIsLoadingDialogs(false);

         if (defaultDialogId) {
            const dialogsData = await getDialogs();
            let find = dialogsData.find(item => item.id === defaultDialogId);

            if (find) {
               console.log(find);

               setCurrentDialog(find);
               connectToChat(find.id);
               getDialog(find.id);
            }
         }
         setIsLoadingDialog(false);

         const channelDialog = window.Echo.join(`user-dialogs.${userInfo.id}`);
         channelDialog.stopListening('UserDialogsEvent');
         channelDialog.listen('UserDialogsEvent', data => {
            getDialogs().then(res => {
               setDialogs(res);
            });
         });
      };

      fetchData();
   }, []);

   useEffect(() => {
      if (tag && messageText) {
         const newSearchParams = new URLSearchParams(searchParams);
         newSearchParams.delete('tag');

         setSearchParams(newSearchParams);
      }
   }, [tag]);

   useEffect(() => {
      const fetch = async () => {
         const dialogsData = await getDialogs();
         let find = dialogsData.find(item => item.id === defaultDialogId);

         if (find) {
            setCurrentDialog(find);
            connectToChat(find.id);
            getDialog(find.id);
            setSearchParams({ dialog: find.id });
         }
      };

      if (videoCallData && defaultDialogId) {
         setVideoCallActive(Boolean(videoCallData));
         fetch();
      }
   }, [videoCallData, defaultDialogId]);

   const connectToChat = id => {
      const channelDialog = window.Echo.join(`dialog.${id}`);
      channelDialog.stopListening('DialogEvent');
      channelDialog.listen('DialogEvent', () => {
         getDialog(id);
      });
   };

   const getDialog = async id => {
      await getDataRequest(`/api/dialogs/${id}`).then(res => {
         const data = refactDialog(res.data.result);
         setMessages(data);
      });
      setIsLoadingDialog(false);
   };

   const refactDialog = (data = [], ids = []) => {
      return data
         .map(item => {
            return {
               ...item,
               messages: item.messages
                  .filter(item => !ids.includes(item.id))
                  .map((item, index, arr) => {
                     if (index !== 0) {
                        let prevMessageUserId = arr[index - 1].user_id;
                        if (prevMessageUserId === item.user_id) {
                           return { ...item, visibleUser: false };
                        } else {
                           return { ...item, visibleUser: true };
                        }
                     }
                     return { ...item, visibleUser: true };
                  }),
            };
         })
         .filter(item => item.messages.length);
   };

   const sendMessage = async (audioBlob = null) => {
      if (!isEdit) {
         const obj = {
            dialog_id: currentDialog.id,
            recipient_id: currentDialog.companion.id,
            text: messageText || '',
            photos: filesUpload.filter(item => item.type === 'image'),
            video: filesUpload.filter(item => item.type === 'video'),
         };

         const formData = new FormData();

         formData.append('dialog_id', obj.dialog_id);
         formData.append('recipient_id', obj.recipient_id);
         formData.append('text', obj.text);

         if (obj.photos?.length) {
            obj.photos = refactPhotoStageOne(obj.photos);
            refactPhotoStageAppend(obj.photos, formData);
            obj.photos = refactPhotoStageTwo(obj.photos);
            formData.append('photos', JSON.stringify(obj.photos));
         }

         if (obj.video?.length) {
            formData.append('video', obj.video[0].file);
         }

         if (audioBlob) {
            let file = new File([audioBlob], 'audio.ogg', {
               type: 'audio/ogg',
            });

            formData.append('audio', file);
         }

         setMessageText('');
         setFilesUpload([]);
         textareaRef.current.focus();

         await sendPostRequest('/api/messages/new-message', formData, {
            'Content-Type': 'multipart/form-data',
            'Accept-Encodin': 'gzip, deflate, br, zstd',
            Accept: 'application/json',
         });
         await getDialog(currentDialog.id);
         setTimeout(() => {
            scrollMainBlock();
         }, 100);
      } else {
         const obj = {
            text: isEdit.text || '',
            id: isEdit.id,
            dialog_id: isEdit.dialog_id,
            photos: filesUpload.filter(item => item.type === 'image'),
         };

         const formData = new FormData();

         formData.append('text', obj.text);
         formData.append('id', obj.id);
         formData.append('dialog_id', obj.dialog_id);

         if (obj.photos?.length) {
            obj.photos = refactPhotoStageOne(obj.photos);
            refactPhotoStageAppend(obj.photos, formData);
            obj.photos = refactPhotoStageTwo(obj.photos);
            formData.append('photos', JSON.stringify(obj.photos));
         }

         await sendPostRequest('/api/messages/update-message', formData, {
            'Content-Type': 'multipart/form-data',
            'Accept-Encodin': 'gzip, deflate, br, zstd',
            Accept: 'application/json',
         });
         setIsEdit(false);
         setFilesUpload([]);
         textareaRef.current.focus();
      }
   };

   const scrollMainBlock = () => {
      setTimeout(() => {
         if (!mainBlockBar.current) return;
         mainBlockBar.current.scrollTop = mainBlockBar.current.scrollHeight;
      }, 1);
   };

   const sendVoiceRecorder = blob => {
      sendMessage(blob);
   };

   const deleteMessages = (ids = [], dialog_id = null, all = false) => {
      if (dialog_id === null) return;
      setDeleteMessagesModal({
         ids,
         dialog_id,
         all,
      });
   };

   const forwardMessage = (messageId, toDialogId) => {
      console.log(messageId, toDialogId);
   };

   return {
      dialogs,
      currentDialog,
      setCurrentDialog,
      connectToChat,
      getDialog,
      setIsLoadingDialog,
      messages,
      isLoadingDialog,
      sendMessage,
      mainBlockBar,
      messageText,
      setMessageText,
      textareaRef,
      chatBuildingInfoRef,
      chatBottomRef,
      chatRootRef,
      sendVoiceRecorder,
      getDialogs,
      setDialogs,
      deleteMessages,
      setMessages,
      refactDialog,
      isEdit,
      setIsEdit,
      isVoiceRecording,
      setIsVoiceRecording,
      filesUpload,
      setFilesUpload,
      videoCallActive,
      setVideoCallActive,
      dialogBuilding,
      isOpenSmileMenu,
      setIsOpenSmileMenu,
      isOpenMenu,
      setIsOpenMenu,
      isVisibleBtnArrow,
      setIsVisibleBtnArrow,
      deleteMessagesModal,
      setDeleteMessagesModal,
      userInfo,
      isLoadingDialogs,
      forwardMessage,
      forwardMessageId,
      setForwardMessageId,
      createEventModal,
      setCreateEventModal,
   };
};
