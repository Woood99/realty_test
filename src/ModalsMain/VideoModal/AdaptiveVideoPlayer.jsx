import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import cn from 'classnames';

import 'video.js/dist/video-js.css';

const AdaptiveVideoPlayer = ({ src, type = 'video/mp4' }) => {
   const videoRef = useRef(null);
   const playerRef = useRef(null);
   const [isVertical, setIsVertical] = useState(false);

   useEffect(() => {
      if (!videoRef.current) return;

      // Инициализация Video.js
      playerRef.current = videojs(videoRef.current, {
         controls: true,
         responsive: true,
         fluid: true, // Адаптивный режим
      });

      const player = playerRef.current;

      player.on('loadedmetadata', () => {
         const videoWidth = player.videoWidth();
         const videoHeight = player.videoHeight();
         const aspectRatio = videoWidth / videoHeight;

         // Определяем, вертикальное ли видео (например, 9:16)
         const vertical = aspectRatio < 0.8; // Порог можно настроить (0.8 ≈ 4:5)
         setIsVertical(vertical);

         if (vertical) {
            player.addClass('vjs-vertical-video');
         } else {
            player.addClass('vjs-horizontal-video');
         }
      });

      // Очистка при размонтировании
      return () => {
         if (playerRef.current) {
            playerRef.current.dispose();
         }
      };
   }, []);

   return (
      <div className={cn('max-w-full mx-auto rounded-xl video-player adaptive-video-player', isVertical ? 'w-full max-w-[330px] aspect-shorts mx-auto' : 'aspect-video')}>
         <video ref={videoRef} className="video-js w-full h-full" playsInline>
            <source src={src} type={type} />
         </video>
      </div>
   );
};

export default AdaptiveVideoPlayer;
