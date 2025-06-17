import React, { useContext, useEffect } from 'react';
import { ChatContext } from '../../context';
import { IconArrow, IconLock, IconSearch, IconСamcorder } from '../../ui/Icons';

import styles from './Chat.module.scss';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import UserInfo from '../../ui/UserInfo';
import { useSelector } from 'react-redux';
import { RoutesPath } from '../../constants/RoutesPath';
import getSrcImage from '../../helpers/getSrcImage';
import { ThumbPhotoDefault } from '../../ui/ThumbPhoto';
import ChatMessages from './ChatMessages';
import UserPosition from '../../ui/UserPosition';
import Button from '../../uiForm/Button';
import { ROLE_ADMIN, ROLE_BUYER } from '../../constants/roles';
import { getIsDesktop, getUserInfo } from '../../redux/helpers/selectors';
import { useSearchParams } from 'react-router-dom';
import { getShortNameSurname } from '../../helpers/changeString';
import WebSkeleton from '../../ui/Skeleton/WebSkeleton';

const ChatMain = () => {
   const {
      currentDialog,
      setCurrentDialog,
      isLoadingDialog,
      chatBuildingInfoRef,
      chatRootRef,
      setVideoCallActive,
      dialogBuilding,
      setIsOpenSmileMenu,
      setIsOpenMenu,
      chatSearchDialog,
   } = useContext(ChatContext);

   const { openSearchPanel } = chatSearchDialog;

   const isDesktop = useSelector(getIsDesktop);
   const userInfo = useSelector(getUserInfo);

   const [searchParams, setSearchParams] = useSearchParams();

   const isOrganization = currentDialog.organization && userInfo?.role?.id !== ROLE_ADMIN.id;
   const currentDialogCompanion = !isEmptyArrObj(currentDialog) ? isOrganization ? currentDialog.organization : currentDialog.companions[0] : {};
   
   useEffect(() => {
      if (chatRootRef.current) {
         chatRootRef.current.style.setProperty('--chat-buildingInfo-height', `${chatBuildingInfoRef.current?.scrollHeight || 0}px`);
      }
   }, [chatBuildingInfoRef.current]);

   return (
      <div className={`${styles.ChatMain} ${!isDesktop ? `${!isEmptyArrObj(currentDialog) ? styles.ChatMainActive : ''}` : ''}`}>
         <div className={styles.ChatMainInner}>
            <div className="min-h-16 h-16 px-4 flex items-center border-b border-b-primary800 bg-white">
               {!isDesktop && !isEmptyArrObj(currentDialog) && (
                  <button
                     onClick={() => {
                        setIsOpenSmileMenu(false);
                        setIsOpenMenu(false);
                        setCurrentDialog({});

                        searchParams.delete('dialog');
                        setSearchParams(searchParams);
                     }}
                     className="mr-4">
                     <IconArrow className="rotate-180" width={26} height={26} />
                  </button>
               )}
               {isLoadingDialog ? (
                  <div className="flex items-center gap-3">
                     <WebSkeleton className="w-[38px] h-[38px] rounded-full" />
                     <WebSkeleton className="w-[150px] h-8 rounded-lg" />
                  </div>
               ) : (
                  <>
                     {/* {!isEmptyArrObj(currentDialog) && (
                        <>
                           <UserInfo
                              avatar={currentDialogCompanion.image}
                              name={
                                 isOrganization
                                    ? currentDialogCompanion.name
                                    : getShortNameSurname(currentDialogCompanion.name, currentDialogCompanion.surname)
                              }
                              pos={currentDialog.companion?.role !== ROLE_ADMIN.id && <UserPosition role={currentDialog.companion.role} />}
                              centered
                              nameHref={`${
                                 currentDialog.companion?.role !== ROLE_BUYER.id
                                    ? `${
                                         isOrganization
                                            ? `${RoutesPath.developers.inner}${currentDialog.organization.id}`
                                            : `${RoutesPath.specialists.inner}${currentDialog.companion.id}`
                                      } `
                                    : ''
                              }`}
                           />
                           <button type="button" className="ml-auto flex-center-all" onClick={openSearchPanel}>
                              <IconSearch width={24} height={24} />
                           </button>
                           {(!currentDialog.organization || userInfo?.role?.id === ROLE_ADMIN.id) && (
                              <div className="ml-4 flex items-center gap-4">
                                 <Button size="Small" variant="secondary" className="gap-3" onClick={() => setVideoCallActive(true)}>
                                    {isDesktop && 'Видеозвонок'}
                                    <IconСamcorder className="stroke-blue stroke-[2px]" />
                                 </Button>
                              </div>
                           )}
                        </>
                     )} */}
                  </>
               )}
            </div>
            {isLoadingDialog ? (
               <div className="px-4 py-2 flex items-center gap-3 bg-white">
                  <WebSkeleton className="w-[55px] h-[45px] rounded-lg" />
                  <WebSkeleton className="w-[200px] h-[40px] rounded-lg" />
               </div>
            ) : (
               <>
                  {Boolean(dialogBuilding) && (
                     <a
                        href={`${RoutesPath.building}${dialogBuilding.id}`}
                        target="_blank"
                        className="px-4 py-2 flex gap-3 group bg-white"
                        ref={chatBuildingInfoRef}>
                        <ThumbPhotoDefault style={{ width: 55, height: 45, borderRadius: 8 }}>
                           <img src={getSrcImage(dialogBuilding.images[0])} />
                        </ThumbPhotoDefault>
                        <div>
                           <h4 className="title-4 hover:!text-blue">ЖК {dialogBuilding.name}</h4>
                           <p className="mt-1">{dialogBuilding.address}</p>
                        </div>
                     </a>
                  )}
               </>
            )}

            {!isEmptyArrObj(currentDialog) ? (
               <ChatMessages isOrganization={isOrganization} currentDialogCompanion={currentDialogCompanion} />
            ) : (
               <>
                  {!isLoadingDialog && (
                     <div className="title-2-5 h-full w-full flex items-center justify-center">Выберите, кому хотели бы написать</div>
                  )}
                  {isLoadingDialog && (
                     <div className="title-2-5 h-full w-full flex items-center justify-center gap-3">
                        <IconLock width={25} height={25} />
                        Защищено сквозным шифрованием
                     </div>
                  )}
               </>
            )}
         </div>
      </div>
   );
};

export default ChatMain;
