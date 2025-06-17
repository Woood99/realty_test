import { getIsDesktop } from '../../../redux/helpers/selectors';
import { useSelector } from 'react-redux';
import BlockShorts from '../../../components/BlockShorts';
import VideoCard from '../../../ui/VideoCard';
import { combinedArray } from '../../../helpers/arrayMethods';
import { useContext, useEffect, useState } from 'react';
import { HomeContext } from '..';
import { shuffleArray } from '../../../helpers/shuffleArray';
import TitleIcon from '../TitleIcon';
import { IconVideo } from '../../../ui/Icons';

const ShowcaseVideos = () => {
   const { videoCards, shortsCards, getVideo } = useContext(HomeContext);
   const isDesktop = useSelector(getIsDesktop);

   const [randomVideos, setRandomVideos] = useState([]);
   const [randomShorts, setRandomShorts] = useState([]);

   useEffect(() => {
      if (!videoCards.data.length) return;

      setRandomVideos(shuffleArray(videoCards.data).slice(0, 5));
   }, [videoCards.data]);

   useEffect(() => {
      if (!shortsCards.data.length) return;

      setRandomShorts(shuffleArray(shortsCards.data).slice(0, 3));
   }, [shortsCards.data]);

   if (!combinedArray(videoCards.data, shortsCards.data).length) return;

   return (
      <div className="container mt-3">
         <div className="white-block">
            <TitleIcon icon={<IconVideo width={20} height={20} />} text="Видео и клипы" />
            <div className="grid grid-cols-2 gap-2">
               <div>
                  {Boolean(randomVideos[0]) && <VideoCard data={randomVideos[0]} userVisible visibleContent={false} />}
                  <div className="flex gap-2 justify-end">
                     <div className="w-[240px]">
                        {Boolean(randomVideos[1]) && <VideoCard data={randomVideos[1]} userVisible visibleContent={false} />}
                     </div>
                     <div className="w-[290px]">
                        {Boolean(randomVideos[2]) && <VideoCard data={randomVideos[2]} userVisible visibleContent={false} />}
                     </div>
                  </div>
               </div>
               <div>
                  <div className="flex gap-2 items-end">
                     <div className="w-[290px]">
                        {Boolean(randomVideos[3]) && <VideoCard data={randomVideos[3]} userVisible visibleContent={false} />}
                     </div>
                     <div className="w-[240px]">
                        {Boolean(randomVideos[4]) && <VideoCard data={randomVideos[4]} userVisible visibleContent={false} />}
                     </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                     <BlockShorts data={randomShorts} onlyImage={true} />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ShowcaseVideos;
