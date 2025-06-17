import { useContext } from 'react';
import { ChatContext } from '../../../../context';
import { RoutesPath } from '../../../../constants/RoutesPath';
import { ThumbPhotoDefault } from '../../../../ui/ThumbPhoto';
import WebSkeleton from '../../../../ui/Skeleton/WebSkeleton';
import getSrcImage from '../../../../helpers/getSrcImage';
import { IconArrow } from '../../../../ui/Icons';

const ChatMainBuildingTop = () => {
   const { isLoadingDialog, dialogBuilding, chatBuildingInfoRef } = useContext(ChatContext);

   if (isLoadingDialog) {
      return (
         <div className="px-4 py-2 flex items-center gap-3 bg-white">
            <WebSkeleton className="w-[55px] h-[45px] rounded-lg" />
            <WebSkeleton className="w-[200px] h-[40px] rounded-lg" />
         </div>
      );
   }

   if (!Boolean(dialogBuilding)) return;

   return (
      <div className="bg-white p-2">
         <a
            href={`${RoutesPath.building}${dialogBuilding.id}`}
            target="_blank"
            className="flex items-center gap-3 group bg-pageColor p-1.5 rounded-lg"
            ref={chatBuildingInfoRef}>
            <ThumbPhotoDefault style={{ width: 55, height: 45, borderRadius: 8 }}>
               <img src={getSrcImage(dialogBuilding.images[0])} />
            </ThumbPhotoDefault>
            <div>
               <h4 className="title-4 hover:!text-blue">ЖК {dialogBuilding.name}</h4>
               <p className="mt-1 text-dark">{dialogBuilding.address}</p>
            </div>
            <IconArrow width={26} height={26} className='ml-auto self-center fill-dark'/>
         </a>
      </div>
   );
};

export default ChatMainBuildingTop;
