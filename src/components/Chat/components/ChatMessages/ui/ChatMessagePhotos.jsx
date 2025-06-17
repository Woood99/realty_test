import React, { useContext, useEffect, useState } from 'react';

import getSrcImage from '../../../../../helpers/getSrcImage';
import { ChatMessageContext } from '../../../../../context';
import { groupImagesIntoRows } from '../../../helpers/groupImagesIntoRows';

const ChatMessagePhotos = () => {
   const { data } = useContext(ChatMessageContext);

   const images = data.photos;

   if (!images?.length) return;

   const [imageData, setImageData] = useState([]);

   useEffect(() => {
      const loadImages = async () => {
         const data = await Promise.all(
            images
               .map(src => getSrcImage(src))
               .map(async src => {
                  const img = new Image();
                  img.src = src;
                  await img.decode();
                  return {
                     src,
                     width: img.naturalWidth,
                     height: img.naturalHeight,
                     aspectRatio: img.naturalWidth / img.naturalHeight,
                  };
               })
         );
         setImageData(data);
      };

      loadImages();
   }, [images]);

   const rows = groupImagesIntoRows(imageData);

   return (
      <div className="gallery-image-grid">
         {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="gallery-image-row">
               {row.map((image, index) => (
                  <div
                     key={index}
                     className={`gallery-image-item ${row.length === 1 ? 'wide' : row.length === 2 ? 'square' : ''}`}
                     style={{
                        backgroundImage: `url(${image.src})`,
                     }}
                  />
               ))}
            </div>
         ))}
      </div>
   );
};

export default ChatMessagePhotos;
