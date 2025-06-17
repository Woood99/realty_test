import { sendPostRequest } from '../../../api/requestsApi';

const getApartmentsPlayer = (data = [9999999999999], maxLength = 100) => {
   const structureApartData = data => {
      return {
         pages: data.pages,
         total: data.total,
         items: data.items.map(item => {
            return {
               ...item,
               title: `${item.rooms === 0 ? 'Студия' : `${item.rooms}-комн.`} ${item.area} м²,  ${item.floor}/${item.building_floors} эт.`,
            };
         }),
      };
   };

   return sendPostRequest('/api/apartments', { ids: data, per_page: maxLength, sort: 'priceAsc' }).then(res => structureApartData(res.data));
};

export default getApartmentsPlayer;
