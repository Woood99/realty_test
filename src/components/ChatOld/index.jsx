import React, { useState } from 'react';

import styles from './Chat.module.scss';
import { ChatContext } from '../../context';
import ChatMain from './ChatMain';
import ChatModalDeleteMessages from './ChatComponents/ChatModalDeleteMessages';
import ChatVideoCall from './ChatVideoCall';
import ChatSidebar from './ChatSidebar';
import { useChat } from './useChat';
import cn from 'classnames';
import ChannelGroupFormModal from './ChatComponents/ChannelGroupFormModal/ChannelGroupFormModal';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import ChatSidebarRight from './ChatSidebarRight';
import { useChatSearchDialog } from './useChatSearchDialog';
import ChatModalSearchDialogs from './ChatComponents/ChatModalSearchDialogs';
import ChatCreateEventModal from './ChatComponents/ChatCreateEvent';

const Chat = ({ onCloseModal, defaultDialogId = null, videoCallData = null, variantChat = 'page', tag }) => {
   const options = useChat(defaultDialogId, videoCallData, tag);

   const chatSearchDialog = useChatSearchDialog();

   const [groupFormModal, setGroupFormModal] = useState(false);
   const [channelFormModal, setChannelFormModal] = useState(false);

   return (
      <ChatContext.Provider
         value={{
            onCloseModal,
            videoCallData,
            variantChat,
            ...options,
            groupFormModal,
            setGroupFormModal,
            channelFormModal,
            setChannelFormModal,
            chatSearchDialog,
         }}>
         <div className={cn(styles.ChatRoot, variantChat === 'mini' && styles.ChatRootMini)} ref={options.chatRootRef}>
            <div className={styles.ChatContainer}>
               <ChatSidebar />
               <ChatMain />
               <ChatSidebarRight />
            </div>
         </div>
         <ChatModalDeleteMessages deleteMessagesModal={options.deleteMessagesModal} setDeleteMessagesModal={options.setDeleteMessagesModal} />
         <ChatVideoCall partnerInfo={options.currentDialog.companion} authuserid={options.userInfo.id} />

         <ChannelGroupFormModal type="group" condition={groupFormModal} set={setGroupFormModal} />
         <ChannelGroupFormModal type="channel" condition={channelFormModal} set={setChannelFormModal} />
         <ModalWrapper condition={options.forwardMessageId}>
            <ChatModalSearchDialogs
               condition={options.forwardMessageId}
               set={options.setForwardMessageId}
               selectedType="single"
               options={{ title: 'Переслать...' }}
               onChange={options.forwardMessage}
            />
         </ModalWrapper>
         <ChatCreateEventModal/>
      </ChatContext.Provider>
   );
};

export default Chat;
