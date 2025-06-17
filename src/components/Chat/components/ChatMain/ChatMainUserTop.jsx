import { useContext, useState } from 'react';
import cn from 'classnames';
import { ChatContext } from '../../../../context';
import UserInfo from '../../../../ui/UserInfo';
import isEmptyArrObj from '../../../../helpers/isEmptyArrObj';
import WebSkeleton from '../../../../ui/Skeleton/WebSkeleton';
import { getShortNameSurname } from '../../../../helpers/changeString';
import { RoutesPath } from '../../../../constants/RoutesPath';
import { ROLE_ADMIN } from '../../../../constants/roles';
import { CHAT_TYPES } from '../../constants';
import { IconEllipsis, IconSearch } from '../../../../ui/Icons';
import { declensionParticipant } from '../../../../helpers/declensionWords';
import { ChatTooltipDialog } from '..';

const ChatMainUserTop = () => {
   const {
      currentDialog,
      currentDialogUserInfo,
      setVideoCallActive,
      chatSearchDialog,
      isOrganization,
      isLoadingDialog,
      setCurrentDialogSettings,
      setChannelGroupInfoModal,
   } = useContext(ChatContext);

   const { openSearchPanel } = chatSearchDialog;

   const [showPopperSettings, setShowPopperSettings] = useState(false);

   if (isLoadingDialog) {
      return (
         <div className="flex items-center gap-3">
            <WebSkeleton className="w-[38px] h-[38px] rounded-full" />
            <WebSkeleton className="w-[150px] h-8 rounded-lg" />
         </div>
      );
   }

   if (isEmptyArrObj(currentDialog)) return;

   const channelOrGroup = currentDialog.dialog_type === CHAT_TYPES.CHANNEL || currentDialog.dialog_type === CHAT_TYPES.GROUP;

   return (
      <>
         <UserInfo
            className={cn(channelOrGroup && 'cursor-pointer')}
            onClick={() => {
               if (channelOrGroup) {
                  setCurrentDialogSettings(currentDialog);
                  setChannelGroupInfoModal(true);
               }
            }}
            avatar={currentDialogUserInfo.image}
            name={getShortNameSurname(currentDialogUserInfo.name, currentDialogUserInfo.surname)}
            pos={
               <>
                  {(currentDialog.dialog_type === CHAT_TYPES.CHANNEL || currentDialog.dialog_type === CHAT_TYPES.GROUP) && (
                     <>{declensionParticipant(currentDialog.companions.length + (currentDialog.owner ? 1 : 0))}</>
                  )}
               </>
            }
            centered
            nameHref={
               currentDialog.dialog_type === CHAT_TYPES.CHAT
                  ? `${
                       currentDialogUserInfo.isOrganization
                          ? `${RoutesPath.developers.inner}${currentDialogUserInfo.id}`
                          : `${RoutesPath.specialists.inner}${currentDialogUserInfo.id}`
                    }
                  `
                  : null
            }
         />
         <button className="ml-auto flex-center-all">
            <ChatTooltipDialog
               options={{
                  data: currentDialog,
                  showPopper: showPopperSettings,
                  setShowPopper: setShowPopperSettings,
                  ElementTargetLayout: <IconEllipsis className={cn('pointer-events-none rotate-90 fill-dark')} width={20} height={20} />,
               }}
            />
         </button>
         {/* <button type="button" className="ml-auto flex-center-all" onClick={openSearchPanel}>
            <IconSearch width={24} height={24} />
         </button> */}
         {/* {(!currentDialog.organization || userInfo?.role?.id === ROLE_ADMIN.id) && (
            <div className="ml-4 flex items-center gap-4">
               <Button size="Small" variant="secondary" className="gap-3" onClick={() => setVideoCallActive(true)}>
                  {isDesktop && 'Видеозвонок'}
                  <IconСamcorder className="stroke-blue stroke-[2px]" />
               </Button>
            </div>
         )} */}
      </>
   );
};

export default ChatMainUserTop;
