import React, { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

import styles from '../Chat.module.scss';
import { ChatContext, ChatMessagesContext } from '../../../context';
import UserInfo from '../../../ui/UserInfo';
import { Tooltip } from '../../../ui/Tooltip';
import { IconArrow, IconDoubleTick, IconEdit, IconEllipsis, IconTrash } from '../../../ui/Icons';
import getSrcImage from '../../../helpers/getSrcImage';
import { VideoPlayer } from '../../../ModalsMain/VideoModal';
import BlockPersonalDiscount from '../../BlockPersonalDiscount';
import VoicePlayer from '../../VoicePlayer';
import { BASE_URL } from '../../../constants/api';
import { getApartmentTitle } from '../../../helpers/getApartmentTitle';
import { getIsDesktop, getUserInfo } from '../../../redux/helpers/selectors';
import cn from 'classnames';
import { SMILES_ONE } from '../../../data/smiles';
import { SmileItem } from '../ChatSmile';

const GalleryLayout = ({ images }) => {
   const [imageData, setImageData] = useState([]);

   useEffect(() => {
      const loadImages = async () => {
         const data = await Promise.all(
            images
               .map(src => getSrcImage(src))
               .map(async src => {
                  const img = new Image();
                  img.src = src;
                  await img.decode();
                  return {
                     src,
                     width: img.naturalWidth,
                     height: img.naturalHeight,
                     aspectRatio: img.naturalWidth / img.naturalHeight,
                  };
               })
         );
         setImageData(data);
      };

      loadImages();
   }, [images]);

   const groupImagesIntoRows = images => {
      const rows = [];
      let currentRow = [];

      images.forEach(image => {
         if (image.aspectRatio >= 1.5) {
            // Широкая картинка занимает всю строку
            if (currentRow.length > 0) {
               rows.push(currentRow);
               currentRow = [];
            }
            rows.push([image]);
         } else {
            // Квадратная картинка
            currentRow.push(image);
            if (currentRow.length === 2) {
               rows.push(currentRow);
               currentRow = [];
            }
         }
      });

      if (currentRow.length > 0) {
         rows.push(currentRow);
      }

      return rows;
   };

   const rows = groupImagesIntoRows(imageData);

   return (
      <div className="gallery-image-grid">
         {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="gallery-image-row">
               {row.map((image, index) => (
                  <div
                     key={index}
                     className={`gallery-image-item ${row.length === 1 ? 'wide' : row.length === 2 ? 'square' : ''}`}
                     style={{
                        backgroundImage: `url(${image.src})`,
                     }}
                  />
               ))}
            </div>
         ))}
      </div>
   );
};

const ChatMessage = ({ data }) => {
   const { currentDialog, deleteMessages, setIsEdit, setForwardMessageId } = useContext(ChatContext);
   const { setFilesUpload, handlePlayAudio, handleStopAudio } = useContext(ChatMessagesContext);

   const userInfo = useSelector(getUserInfo);
   const isDesktop = useSelector(getIsDesktop);

   const [showPopper, setShowPopper] = useState(false);

   const myMessage = data.recipient_id !== userInfo.id;

   const video = data.files?.filter(item => item.type === 'video')[0];
   const audio = data.files?.filter(item => item.type === 'audio')[0];
   const dataText = data.is_json ? JSON.parse(data.text) : data.text;

   if (!dataText && !video && !audio && !data.photos?.length) {
      return;
   }

   return (
      <div className={`${styles.ChatMessage} ${myMessage ? styles.ChatMessageMe : styles.ChatMessageOther}`}>
         {data.visibleUser && (
            <UserInfo
               avatar={data.user.image}
               name={myMessage ? 'Вы' : data.user.name}
               textAvatar={data.user.name}
               className={styles.ChatMessageUser}
               centered
            />
         )}
         <div
            className={styles.ChatMessageInner}
            onClick={e => {
               if (!isDesktop) {
                  const target = e.target;
                  if (target.closest('.video-player') || target.closest('.voice-player')) {
                     return;
                  }
                  setShowPopper(!showPopper);
               }
            }}
            onContextMenu={e => {
               if (isDesktop) {
                  e.preventDefault();
                  setShowPopper(!showPopper);
               }
            }}>
            <div
               className={cn(
                  styles.ChatMessageBlock,
                  (data.photos?.length || video || data.is_json) && styles.ChatMessageBlockFiles,
                  audio && styles.ChatMessageBlockAudio,
                  (data.photos?.length || video) && dataText && styles.ChatMessageBlockFilesText
               )}>
               {Boolean(data.photos?.length || video || data.is_json) && (
                  <div className={`flex flex-col gap-1 p-1.5`}>
                     {Boolean(data.photos?.length) && <GalleryLayout images={data.photos} />}
                     {video && (
                        <div>
                           <VideoPlayer
                              data={{
                                 video_url: video.url,
                              }}
                              variant="default"
                              className="h-full w-full"
                              autoplay={false}
                           />
                        </div>
                     )}
                     {Boolean(data.is_json && dataText && currentDialog.building && dataText.notificationable) && (
                        <BlockPersonalDiscount
                           data={{
                              id: dataText.id,
                              property_type: dataText.notificationable_type === 'App\\Models\\Building' ? 'complex' : 'apartment',
                              type: dataText.is_absolute ? 'price' : dataText.is_special_condition ? 'special-condition' : 'prc',
                              object_id: dataText.discountable_id,
                              valid_till: dataText.valid_till,
                              discount: dataText.discount,
                              author: dataText.author,
                           }}
                           mainData={{
                              ...dataText.notificationable,
                              title:
                                 dataText.notificationable_type === 'App\\Models\\Building'
                                    ? dataText.notificationable.title || dataText.notificationable.name
                                    : getApartmentTitle(dataText.notificationable),
                           }}
                        />
                     )}
                  </div>
               )}
               {Boolean(audio) && (
                  <div className="voice-player">
                     <VoicePlayer
                        audioUrl={`${BASE_URL}${audio.url}`}
                        onPlay={handlePlayAudio}
                        onStop={handleStopAudio}
                        downloadParams={{
                           dialog_id: currentDialog.id,
                           message_id: data.id,
                        }}
                     />
                  </div>
               )}
               {Boolean(!data.is_json && dataText) && (
                  <span className={cn(styles.ChatMessageText, showPopper && '!bg-hoverPrimary')}>{dataText}</span>
               )}
               <div className={cn(styles.ChatMessageTime, (data.photos?.length || video) && !dataText && styles.ChatMessageTimeBg)}>
                  {dayjs(data.created_at).format('HH:mm')}
                  <IconDoubleTick width={14} height={14} className={cn('translate-y-[2px] fill-graySecond', data.is_read && '!fill-blue')} />
               </div>
               <Tooltip
                  mobile
                  color="white"
                  ElementTarget={() => <IconEllipsis className="fill-white pointer-events-none" width={16} height={16} />}
                  classNameTarget={`${styles.ChatMessageMore} ${myMessage ? styles.ChatMessageMoreMe : styles.ChatMessageMoreOther}`}
                  classNameContent="!p-0 overflow-hidden !shadow-none bg-transparent-imp !rounded-none"
                  placement={`${myMessage ? 'bottom-start' : 'bottom-start'}`}
                  event="click"
                  value={showPopper}
                  classNameTargetActive={styles.ChatMessageMoreActive}
                  onChange={setShowPopper}>
                  <div className="flex flex-col items-center gap-2">
                     <div className="bg-white p-1 rounded-lg">
                        {SMILES_ONE.map((item, index) => (
                           <SmileItem key={index} item={item} />
                        ))}
                     </div>
                     <div className="mmd1:bg-white mmd1:shadow-primary flex flex-col items-start rounded-[10px] overflow-hidden min-w-52">
                        <button
                           className={styles.ChatMessageButton}
                           onClick={() => {
                              setShowPopper(false);
                              setForwardMessageId(data.id);
                           }}>
                           <IconArrow width={15} height={15} />
                           Переслать
                        </button>
                        {Boolean(myMessage && !data.is_json && !audio) && (
                           <button
                              className={styles.ChatMessageButton}
                              onClick={() => {
                                 setShowPopper(false);
                                 setFilesUpload(
                                    data.photos
                                       ? data.photos.map((item, index) => {
                                            return {
                                               id: index + 1,
                                               image: item,
                                               type: 'image',
                                            };
                                         })
                                       : []
                                 );
                                 setIsEdit({
                                    text: data.text || '',
                                    text_old: data.text || '',
                                    id: data.id,
                                    dialog_id: currentDialog.id,
                                 });
                              }}>
                              <IconEdit width={16} height={16} className="stroke-blue stroke-[1.5px]" />
                              Редактировать
                           </button>
                        )}

                        <button
                           className={styles.ChatMessageButton}
                           onClick={() => {
                              setShowPopper(false);
                              deleteMessages([data.id], currentDialog.id, Boolean(myMessage));
                           }}>
                           <IconTrash width={15} height={15} className="fill-red" />
                           Удалить
                        </button>
                     </div>
                  </div>
               </Tooltip>
            </div>
         </div>
      </div>
   );
};

export default ChatMessage;
