import { useContext } from 'react';
import cn from 'classnames';
import { VideoPlayer } from '../../../../../ModalsMain/VideoModal';
import { ChatMessageContext } from '../../../../../context';
import Spinner from '../../../../../ui/Spinner';

const ChatMessageVideo = () => {
   const { data, videoData } = useContext(ChatMessageContext);

   if (!videoData) return;

   return (
      <div className="overflow-hidden relative">
         <VideoPlayer
            data={{
               video_url: videoData.url,
               video_url_test: videoData.test_url,
            }}
            variant="default"
            className="h-full w-full"
            autoplay={false}
            classNameButtonPlay={cn('z-[97]', data.loading && 'hidden')}
         />
         {data.loading && (
            <div className="rounded-xl absolute top-0 left-0 w-full h-full flex-center-all z-[98] bg-[rgba(70,70,70,0.55)]">
               <Spinner className="mx-auto !border-white !border-b-[transparent]" />
            </div>
         )}
      </div>
   );
};

export default ChatMessageVideo;
