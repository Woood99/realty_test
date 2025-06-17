import { useState } from 'react';
import cn from 'classnames';
import styles from './Chat.module.scss';
import { useChat, useChatSearchDialog, useResizeSidebar } from './hooks';
import { ChatContext } from '../../context';
import {
   ChannelGroupFormModal,
   ChannelGroupInfoModal,
   ChannelGroupSettingsModal,
   ChatMain,
   ChatModalBlockedUserList,
   ChatModalDeleteMessages,
   ChatSidebar,
   ChatSidebarRight,
} from './components';
import { CHAT_TYPES } from './constants';
import ModalWrapper from '../../ui/Modal/ModalWrapper';

const Chat = ({ onCloseModal, defaultDialogId = null, videoCallData = null, variantChat = 'page', tag }) => {
   const options = useChat(defaultDialogId, videoCallData, tag);

   const chatSearchDialog = useChatSearchDialog();
   const resizeSidebarOptions = useResizeSidebar(variantChat === 'mini');

   const [groupFormModal, setGroupFormModal] = useState(false);
   const [channelFormModal, setChannelFormModal] = useState(false);
   const [channelGroupSettingsModal, setChannelGroupSettingsModal] = useState(false);
   const [channelGroupInfoModal, setChannelGroupInfoModal] = useState(false);
   const [blockedUserList, setBlockedUserList] = useState(false);

   return (
      <ChatContext.Provider
         value={{
            onCloseModal,
            videoCallData,
            variantChat,
            chatSearchDialog,
            groupFormModal,
            setGroupFormModal,
            channelFormModal,
            setChannelFormModal,
            channelGroupSettingsModal,
            setChannelGroupSettingsModal,
            channelGroupInfoModal,
            setChannelGroupInfoModal,
            setBlockedUserList,
            ...options,
            resizeSidebarOptions,
         }}>
         <div
            className={cn(
               styles.ChatRoot,
               variantChat === 'mini' && styles.ChatRootMini,
               options.themeOptions.theme === 'dark' && styles.ChatThemeDark
            )}
            ref={options.chatRootRef}>
            <div className={styles.ChatContainer}>
               <ChatSidebar />
               <ChatMain />
               <ChatSidebarRight />
            </div>
         </div>
         <ChatModalDeleteMessages deleteMessagesModal={options.deleteMessagesModal} setDeleteMessagesModal={options.setDeleteMessagesModal} />
         {/* <ChatVideoCall partnerInfo={options.currentDialog.companion} authuserid={options.userInfo.id} /> */}

         <ChannelGroupFormModal type={CHAT_TYPES.GROUP} condition={groupFormModal} set={setGroupFormModal} />
         <ChannelGroupFormModal type={CHAT_TYPES.CHANNEL} condition={channelFormModal} set={setChannelFormModal} />
         <ChannelGroupSettingsModal condition={channelGroupSettingsModal} set={setChannelGroupSettingsModal} />
         <ChannelGroupInfoModal condition={channelGroupInfoModal} set={setChannelGroupInfoModal} dialog={options.currentDialogSettings} />
         <ModalWrapper condition={blockedUserList}>
            <ChatModalBlockedUserList condition={blockedUserList} set={setBlockedUserList} />
         </ModalWrapper>
         {/* <ModalWrapper condition={options.forwardMessageId}>
            <ChatModalSearchDialogs
               condition={options.forwardMessageId}
               set={options.setForwardMessageId}
               selectedType="single"
               options={{ title: 'Переслать...' }}
               onChange={options.forwardMessage}
            />
         </ModalWrapper> */}

         {/* <ChatCreateEventModal /> */}
      </ChatContext.Provider>
   );
};

export default Chat;
