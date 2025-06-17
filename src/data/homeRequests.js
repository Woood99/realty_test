const data = [
   {
      id: 5,
      type: 'buildings',
      rooms: [0, 1, 2],
      area_total_from: 11,
      area_total_to: 55,
      floor_from: 2,
      floor_to: 4,
      calc_props: [
         { id: 1, value: 'cash', label: 'Наличные' },
         { id: 5, value: 'certificate', label: 'В сделке будет использоваться сертификат' },
      ],
      price_type: 'object_price_from',
      price: 9000000,
      user: {
         avatarUrl: null,
         name: 'Александр Гаврилов',
         pos: 'Покупатель',
      },
   },
];

export default data;
