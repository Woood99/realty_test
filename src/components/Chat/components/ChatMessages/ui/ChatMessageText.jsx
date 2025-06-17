import { useContext } from 'react';
import { ChatMessageContext } from '../../../../../context';
import isLink from '../../../../../helpers/isLink';
import normalizeLink from '../../../../../helpers/normalizeLink';

import styles from '../../../Chat.module.scss';

const ChatMessageText = () => {
   const { data, dataText } = useContext(ChatMessageContext);

   if (data.is_json || !dataText) return;

   const is_link = isLink(dataText);

   if (is_link) {
      return (
         <a href={normalizeLink(dataText)} target="_blank" className={styles.ChatMessageTextLink}>
            {dataText}
         </a>
      );
   }

   return <span className={styles.ChatMessageText}>{dataText}</span>;
};

export default ChatMessageText;
