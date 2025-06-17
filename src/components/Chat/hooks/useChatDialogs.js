import { getDataRequest } from '../../../api/requestsApi';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { v4 as uuidv4 } from 'uuid';
import { getUserInfo } from '../../../redux/helpers/selectors';
import { useSelector } from 'react-redux';
import { getLastElementArray } from '../../../helpers/arrayMethods';

dayjs.extend(utc);

export const useChatDialogs = () => {
   const userInfo = useSelector(getUserInfo);

   const refactDialog = (data = []) => {
      const result = data.map(item => {
         const blocks = [];
         let currentBlock = null;

         item.messages.forEach(message => {
            const isSameUserAsLast = currentBlock && currentBlock.user.id === message.user.id;
            if (isSameUserAsLast) {
               currentBlock.messages.push({
                  ...message,
                  user_visible: false,
               });
            } else {
               currentBlock = {
                  user: message.user,
                  messages: [
                     {
                        ...message,
                        user_visible: true,
                     },
                  ],
               };
               blocks.push(currentBlock);
            }
         });

         return {
            date: item.date,
            blocks,
         };
      });

      return result;
   };

   const dialogRemoveMessageIds = (messages = [], ids = []) => {
      return messages
         .map(item => ({
            ...item,
            blocks: item.blocks
               .map(item => ({
                  ...item,
                  messages: item.messages
                     .filter(item => !ids.includes(item.id))
                     .map((item, index) => {
                        if (index === 0) {
                           return {
                              ...item,
                              user_visible: true,
                           };
                        }
                        return item;
                     }),
               }))
               .filter(item => item.messages.length),
         }))
         .filter(item => item.blocks.length);
   };

   const dialogAddMessage = (messages = [], formData) => {
      const obj = {
         dialog_id: formData.get('dialog_id'),
         text: formData.get('text') || '',
         audio: formData.get('audio'),
         video: formData.get('video'),
         photos: formData.get('photos'),
      };

      const currentDate = dayjs().format('YYYY-MM-DD');
      const utcTime = dayjs().utc().format('YYYY-MM-DDTHH:mm:ss.000000[Z]');

      const audioObj = obj.audio
         ? [
              {
                 id: uuidv4(),
                 dialog_id: obj.dialog_id,
                 message_id: uuidv4(),
                 test_url: URL.createObjectURL(obj.audio),
                 blob: obj.audio,
                 type: 'audio',
                 mime_type: 'audio/ogg',
                 created_at: currentDate,
                 updated_at: currentDate,
                 preview: null,
                 duration: null,
              },
           ]
         : [];

      const videoObj = obj.video
         ? [
              {
                 id: uuidv4(),
                 dialog_id: obj.dialog_id,
                 message_id: uuidv4(),
                 test_url: URL.createObjectURL(obj.video),
                 type: 'video',
                 mime_type: 'video/mp4',
                 created_at: currentDate,
                 updated_at: currentDate,
                 preview: null,
                 duration: null,
              },
           ]
         : [];

      const user = {
         id: userInfo.id,
         image: userInfo.image,
         name: userInfo.name,
         surname: userInfo.surname,
         role: userInfo.role.id,
         last_seen: userInfo.last_seen,
         organization_id: userInfo.organization_id,
      };

      const newMessage = {
         id: uuidv4(),
         dialog_id: obj.dialog_id,
         user_id: userInfo.id,
         text: obj.text,
         photos: obj.photos
            ? JSON.parse(obj.photos).map(item => {
                 return URL.createObjectURL(formData.get(item.image));
              })
            : null,
         created_at: utcTime,
         updated_at: utcTime,
         is_pin: 0,
         user,
         reactions: [],
         reads: [],
         comments: [],
         files: [...audioObj, ...videoObj],
         loading: true,
      };

      let result = messages;

      const findItemByDate = result.find(item => item.date === currentDate);

      if (findItemByDate) {
         result = result.map(item => {
            if (item.date === findItemByDate.date) {
               const lastMatchingBlockIndex2 = item.blocks.reduce((acc, block, index) => (block.user.id === user.id ? index : acc), -1);
               const isLastMatching = lastMatchingBlockIndex2 === item.blocks.length - 1;

               if (isLastMatching) {
                  return {
                     ...item,
                     blocks: item.blocks.map((block, index) => {
                        const lastMatchingBlockIndex = index === item.blocks.length - 1 && block.user.id === user.id;
                        if (lastMatchingBlockIndex) {
                           return { ...block, messages: [...block.messages, newMessage] };
                        }
                        return block;
                     }),
                  };
               } else {
                  return {
                     ...item,
                     blocks: [...item.blocks, { user, messages: [newMessage] }],
                  };
               }
            }
            return item;
         });
      } else {
         result.push({
            date: currentDate,
            blocks: [
               {
                  user,
                  messages: [newMessage],
               },
            ],
         });
      }

      result = result.map(item => ({
         ...item,
         blocks: item.blocks.map(block => ({
            ...block,
            messages: block.messages.map((message, index) => (index === 0 ? { ...message, user_visible: true } : message)),
         })),
      }));

      return result;
   };

   const getDialogs = async () => {
      const {
         data: { result },
      } = await getDataRequest('/api/dialogs');

      return result.map(item => ({ ...item, dialog_type: item.type }));
   };

   return { refactDialog, getDialogs, dialogRemoveMessageIds, dialogAddMessage };
};
