import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import getImagesObj from '../../../unifComponents/getImagesObj';

export const useChatMessages = options => {
   const { mainBlockBar, filesUpload, setFilesUpload, setIsVisibleBtnArrow, isLoadingDialog, currentDialog, messages } = options;

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

   useEffect(() => {
      if (isLoadingDialog) return;
      if (!mainBlockBar.current) return;
      const un_read_messages_count = currentDialog.un_read_messages_count;
      if (un_read_messages_count > 10) {
         const middlePosition = mainBlockBar.current.scrollHeight / 2 - mainBlockBar.current.clientHeight / 2;
         mainBlockBar.current.scrollTop = middlePosition;
      } else {
         mainBlockBar.current.scrollTop = mainBlockBar.current.scrollHeight;
      }
   }, [mainBlockBar.current, isLoadingDialog]);

   return {
      handlePlayAudio,
      handleStopAudio,
      addFile,
      deleteFile,
      filesLimitModal,
      setFilesLimitModal,
      getRootProps,
      getInputProps,
      isDragActive,
      uploadFileOpen: open,
   };
};
