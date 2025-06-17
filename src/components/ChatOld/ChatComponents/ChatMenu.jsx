import React, { useContext, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import styles from '../Chat.module.scss';
import { ChatContext, ChatMessagesContext } from '../../../context';
import { Tooltip } from '../../../ui/Tooltip';
import { getIsDesktop, getUserInfo } from '../../../redux/helpers/selectors';
import { useSelector } from 'react-redux';
import { IconBadge, IconClip, IconFilm, IconImage, IconImageAdd, IconСamcorder } from '../../../ui/Icons';
import { isBuyer, isSeller } from '../../../helpers/utils';
import ModalWrapper from '../../../ui/Modal/ModalWrapper';
import SpecialOfferCreate from '../../../ModalsMain/SpecialOfferCreate';
import { createPortal } from 'react-dom';
import { ROLE_ADMIN } from '../../../constants/roles';

const ChatMenu = () => {
   const {
      setVideoCallActive,
      dialogBuilding,
      currentDialog,
      getDialog,
      chatRootRef,
      isOpenMenu,
      setIsOpenMenu,
      setIsOpenSmileMenu,
      variantChat,
      setCreateEventModal,
   } = useContext(ChatContext);
   const { getInputProps, uploadFileOpen, addFile } = useContext(ChatMessagesContext);
   const isDesktop = useSelector(getIsDesktop);
   const userInfo = useSelector(getUserInfo);
   const userIsSeller = isSeller(userInfo);
   const userIsBuyer = isBuyer(userInfo);

   const [specialOfferModal, setSpecialOfferModal] = useState(false);

   const photoInputRef = useRef(null);
   const videoInputRef = useRef(null);

   const handleFileChange = event => {
      const file = event.target.files[0];
      if (file) {
         addFile([file]);
         event.target.value = null;
      }
   };

   const MenuLayout = () => {
      return (
         <div className={styles.ChatMenuRoot}>
            {(!currentDialog.organization || userInfo?.role?.id === ROLE_ADMIN.id) && (
               <button type="button" className={styles.ChatMenuItem} onClick={() => setVideoCallActive(true)}>
                  <div className={styles.ChatMenuItemIcon}>
                     <IconСamcorder className="stroke-orange stroke-[2px]" />
                  </div>
                  <span className={styles.ChatMenuText}>Видеозвонок</span>
               </button>
            )}

            <button type="button" className={styles.ChatMenuItem} onClick={uploadFileOpen}>
               <div className={styles.ChatMenuItemIcon}>
                  <IconImageAdd className="fill-blue" />
               </div>
               <span className={styles.ChatMenuText}>{isDesktop ? 'Фото/видео/документ' : 'Галерея'}</span>
            </button>
            {!isDesktop && (
               <>
                  <div className={styles.ChatMenuItem}>
                     <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        ref={photoInputRef}
                     />
                     <button
                        type="button"
                        onClick={e => {
                           e.preventDefault();
                           photoInputRef.current.click();
                        }}
                        className={styles.ChatMenuItemBtn}>
                        <div className={styles.ChatMenuItemIcon}>
                           <IconImage className="fill-red" />
                        </div>
                        <span className={styles.ChatMenuText}>Сделать фото</span>
                     </button>
                  </div>
                  {!userIsBuyer && (
                     <div className={styles.ChatMenuItem}>
                        <input
                           type="file"
                           accept="video/*"
                           capture="environment"
                           onChange={handleFileChange}
                           style={{ display: 'none' }}
                           ref={videoInputRef}
                        />
                        <button
                           type="button"
                           onClick={e => {
                              e.preventDefault();
                              videoInputRef.current.click();
                           }}
                           className={styles.ChatMenuItemBtn}>
                           <div className={styles.ChatMenuItemIcon}>
                              <IconFilm className="fill-blue" />
                           </div>
                           <span className={styles.ChatMenuText}>Видеозаметка</span>
                        </button>
                     </div>
                  )}
               </>
            )}
            {userIsSeller && dialogBuilding && currentDialog.companion && (
               <>
                  <button type="button" onClick={() => setSpecialOfferModal(true)} className={styles.ChatMenuItem}>
                     <div className={styles.ChatMenuItemIcon}>
                        <IconBadge className="fill-blue" />
                     </div>
                     <span className={styles.ChatMenuText}>Специальное предложение</span>
                  </button>
               </>
            )}
            {(userIsSeller || false) && (
               <>
                  {/* TODO: создавать может только администратор канала/группы */}
                  <button type="button" className={styles.ChatMenuItem} onClick={() => setCreateEventModal(true)}>
                     <div className={styles.ChatMenuItemIcon}>
                        <IconImageAdd className="fill-blue" />
                     </div>
                     <span className={styles.ChatMenuText}>Мероприятие</span>
                  </button>
               </>
            )}
         </div>
      );
   };

   useEffect(() => {
      const el = document.getElementById('chat-mobile-actions');
      if (el && chatRootRef.current) {
         chatRootRef.current.style.setProperty('--chat-menu-height', `${el.clientHeight}px`);
      }
   }, [isOpenMenu]);

   return (
      <>
         {isOpenMenu && createPortal(<MenuLayout />, document.getElementById('chat-mobile-actions'))}

         <div className={cn('flex-center-all self-center md1:self-center', (variantChat === 'mini' || !isDesktop) && 'mr-2')}>
            {isDesktop ? (
               <>
                  <input {...getInputProps()} />
                  <Tooltip
                     color="white"
                     ElementTarget={() => (
                        <>
                           {variantChat === 'page' ? (
                              <button type="button" className={styles.ChatMenuBtn}>
                                 Меню
                              </button>
                           ) : (
                              <button type="button" className="flex-center-all">
                                 <IconClip />
                              </button>
                           )}
                        </>
                     )}
                     placement="top-start"
                     offset={[0, 12]}
                     classNameContent="!p-0 overflow-hidden">
                     <MenuLayout />
                  </Tooltip>
               </>
            ) : (
               <button
                  type="button"
                  className={styles.ChatMenuBtn}
                  onClick={() => {
                     setIsOpenMenu(prev => !prev);
                     setIsOpenSmileMenu(false);
                  }}>
                  <IconClip />
               </button>
            )}

            {dialogBuilding?.id && (
               <ModalWrapper condition={specialOfferModal}>
                  <SpecialOfferCreate
                     condition={specialOfferModal}
                     set={setSpecialOfferModal}
                     id={dialogBuilding.id}
                     defaultRecipient={currentDialog.companion}
                     defaultBuilding={dialogBuilding}
                     request={() => {
                        getDialog(currentDialog.id);
                     }}
                  />
               </ModalWrapper>
            )}
         </div>
      </>
   );
};

export default ChatMenu;
