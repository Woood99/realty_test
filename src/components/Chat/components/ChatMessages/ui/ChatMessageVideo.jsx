import { useContext } from 'react';
import { ChatMessageContext } from '../../../../../context';
import Spinner from '../../../../../ui/Spinner';
import AdaptiveVideoPlayer from '../../../../../ModalsMain/VideoModal/AdaptiveVideoPlayer';
import { BASE_URL } from '../../../../../constants/api';

const ChatMessageVideo = () => {
   const { data, videoData } = useContext(ChatMessageContext);

   if (!videoData) return;

   return (
      <div className="overflow-hidden relative rounded-xl">
         <AdaptiveVideoPlayer src={videoData.test_url || `${BASE_URL}${videoData.url}`} />
         {data.loading && (
            <div className="rounded-xl absolute top-0 left-0 w-full h-full flex-center-all z-[98] bg-[rgba(70,70,70,0.55)]">
               <Spinner className="mx-auto !border-white !border-b-[transparent]" />
            </div>
         )}
      </div>
   );
};

export default ChatMessageVideo;
