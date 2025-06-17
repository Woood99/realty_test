import React, { useContext, useState } from 'react';
import cn from 'classnames';
import styles from '../Chat.module.scss';
import ChatDialogs from '../ChatDialogs';

import stylesBurger from '../../Header/Header.module.scss';
import BUILDING_ICON from '../../../assets/svg/building.svg';
import ModalWrapper from '../../../ui/Modal/ModalWrapper';
import Modal from '../../../ui/Modal';
import CardIcon from '../../../ui/CardIcon';
import ChatCreateDialogLayout from './ChatCreateDialogLayout';
import { getDialogId } from '../../../api/getDialogId';
import { ChatContext } from '../../../context';
import { useSearchParams } from 'react-router-dom';
import { useResizeSidebar } from '../useResizeSidebar';
import { useSelector } from 'react-redux';
import { getIsDesktop } from '../../../redux/helpers/selectors';
import Input from '../../../uiForm/Input';
import { CHAT_TYPES } from '../constantsChat';

const ChatSidebar = () => {
   const {
      setIsLoadingDialog,
      setCurrentDialog,
      connectToChat,
      getDialog,
      setIsVisibleBtnArrow,
      getDialogs,
      variantChat,
      setGroupFormModal,
      setChannelFormModal,
   } = useContext(ChatContext);
   const [sidebarModalOpen, setSidebarModalOpen] = useState(false);
   const [createDialogWithDevelopModal, setCreateDialogWithDevelopModal] = useState(false);
   const [createDialogWithSpecialistModal, setCreateDialogWithSpecialistModal] = useState(false);
   const { sidebarRef, sidebarWidth, startResizing, sidebarMini, sidebarOptions } = useResizeSidebar(variantChat === 'mini');
   const isDesktop = useSelector(getIsDesktop);

   const [_, setSearchParams] = useSearchParams();

   const onSubmitHandler = async data => {
      setIsLoadingDialog(true);
      const dialogId = await getDialogId(data);
      const dialogsData = await getDialogs();
      let findDialog = dialogsData.find(item => item.id === dialogId);
      if (findDialog) {
         setCurrentDialog(findDialog);
         connectToChat(findDialog.id);
         getDialog(findDialog.id);
         setSearchParams({ dialog: findDialog.id });
      }
      setIsVisibleBtnArrow(false);
      setCreateDialogWithDevelopModal(false);
      setCreateDialogWithSpecialistModal(false);
      setSidebarModalOpen(false);
      setIsLoadingDialog(false);
   };

   return (
      <div
         className={cn(styles.ChatSidebar, sidebarMini && styles.ChatSidebarMini)}
         ref={sidebarRef}
         style={{
            width: isDesktop ? `${sidebarWidth <= sidebarOptions.min_width ? `${sidebarOptions.mini_width}px` : `${sidebarWidth}px`}` : '100%',
         }}>
         <div className={cn('min-h-16 h-16 px-4 flex items-center border-b border-b-primary800', sidebarMini && 'justify-center')}>
            <button className={cn(stylesBurger.MenuBtn, sidebarMini ? '!mx-0' : '!-ml-2')} onClick={() => setSidebarModalOpen(true)}>
               <div className={stylesBurger.burger}>
                  <span className={stylesBurger.burgerLine}></span>
               </div>
            </button>
            <div className="flex-grow">
               <Input placeholder="Поиск" />
            </div>
         </div>
         <ChatDialogs sidebarMini={sidebarMini} />
         {isDesktop && <div className={styles.ChatSidebarResizer} onMouseDown={startResizing} />}

         <ModalWrapper condition={sidebarModalOpen}>
            <Modal
               options={{ overlayClassNames: '_left', modalClassNames: '!w-[500px]', modalContentClassNames: 'md1:flex md1:flex-col' }}
               condition={sidebarModalOpen}
               set={setSidebarModalOpen}>
               <h2 className="title-2 mb-6">Меню</h2>
               <div className="grid grid-cols-2 gap-4">
                  {true && (
                     <>
                        <CardIcon
                           data={{
                              image: BUILDING_ICON,
                              title: 'Создать группу',
                           }}
                           activeOpacity
                           onClick={() => {
                              setSidebarModalOpen(false);
                              setGroupFormModal(true);
                           }}
                        />
                        <CardIcon
                           data={{
                              image: BUILDING_ICON,
                              title: 'Создать канал',
                           }}
                           activeOpacity
                           onClick={() => {
                              setSidebarModalOpen(false);
                              setChannelFormModal(true);
                           }}
                        />
                     </>
                  )}

                  <CardIcon
                     data={{
                        image: BUILDING_ICON,
                        title: 'Застройщики',
                     }}
                     activeOpacity
                     onClick={() => {
                        setSidebarModalOpen(false);
                        setCreateDialogWithDevelopModal(true);
                     }}
                  />
                  <CardIcon
                     data={{
                        image: BUILDING_ICON,
                        title: 'Менеджеры',
                     }}
                     activeOpacity
                     onClick={() => {
                        setSidebarModalOpen(false);
                        setCreateDialogWithSpecialistModal(true);
                     }}
                  />
               </div>
            </Modal>
         </ModalWrapper>
         <ModalWrapper condition={createDialogWithDevelopModal}>
            <ChatCreateDialogLayout
               condition={createDialogWithDevelopModal}
               set={setCreateDialogWithDevelopModal}
               options={{
                  type: 'developers',
                  api: '/api/developers/page',
                  inputPlaceholder: 'Название застройщика',
                  onSubmit: item => {
                     onSubmitHandler({ organization_id: item.id, type: CHAT_TYPES.CHAT });
                  },
               }}
            />
         </ModalWrapper>
         <ModalWrapper condition={createDialogWithSpecialistModal}>
            <ChatCreateDialogLayout
               condition={createDialogWithSpecialistModal}
               set={setCreateDialogWithSpecialistModal}
               options={{
                  type: 'specialists',
                  api: '/api/specialists/page',
                  inputPlaceholder: 'ФИО менеджера',
                  onSubmit: item => {
                     onSubmitHandler({ recipient_id: item.id, type: CHAT_TYPES.CHAT });
                  },
               }}
            />
         </ModalWrapper>
      </div>
   );
};

export default ChatSidebar;
