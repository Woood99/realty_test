export const groupImagesIntoRows = images => {
   const rows = [];
   let currentRow = [];

   images.forEach(image => {
      if (image.aspectRatio >= 1.5) {
         if (currentRow.length > 0) {
            rows.push(currentRow);
            currentRow = [];
         }
         rows.push([image]);
      } else {
         currentRow.push(image);
         if (currentRow.length === 2) {
            rows.push(currentRow);
            currentRow = [];
         }
      }
   });

   if (currentRow.length > 0) {
      rows.push(currentRow);
   }

   return rows;
};
