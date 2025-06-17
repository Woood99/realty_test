import { useContext } from 'react';
import cn from 'classnames';
import styles from '../../../Chat.module.scss';
import { ChatMessageContext } from '../../../../../context';
import { IconClock, IconDoubleTick } from '../../../../../ui/Icons';
import dayjs from 'dayjs';

const ChatMessageTimeAndReads = () => {
   const { data, dataText, videoData } = useContext(ChatMessageContext);

   return (
      <div className={cn(styles.ChatMessageTime, (data.photos?.length || videoData) && !dataText && styles.ChatMessageTimeBg)}>
         {dayjs(data.created_at).format('HH:mm')}
         {data.loading ? (
            <div className="flex-center-all" title="Сообщение отправляется">
               <IconClock width={14} height={14} className="fill-graySecond" />
            </div>
         ) : (
            <IconDoubleTick width={14} height={14} className={cn('translate-y-[2px] fill-graySecond', data.reads?.length && '!fill-blue')} />
         )}
      </div>
   );
};

export default ChatMessageTimeAndReads;
