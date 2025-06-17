const data = [
   {
      id: 1,
      price: 3000000,

      present: false,
      top: 5,
      tags: ['Тег 1', 'Тег 2', 'Тег 3', 'Тег 4'],

      currentStatusPrice: 'up', // up | down
      history: [
         {
            status: 'down', // up | down
            date: '01.01.2024',
            value: 500000,
            price: 2500000,
         },
         {
            status: 'up', // up | down
            date: '22.01.2024',
            value: 320000,
            price: 3000000,
         },
      ],

      rooms: 1,
      area: 14.5,
      floor: '4/12',

      frame: 'Литер 1',
      deadline: '4 кв. 2024',

      name: 'ЖК Вознесенский',
      address: 'Краснодар, ул.Карла-Маркса., 234',

      images: [
         'https://woood99.github.io/inrut-news/app/img/card-1.webp',
         'https://woood99.github.io/inrut-news/app/img/card-3.webp',
         'https://woood99.github.io/inrut-news/app/img/card-6.webp',
         'https://woood99.github.io/inrut-news/app/img/card-9.webp',
      ],

      user: {
         avatarUrl: 'https://woood99.github.io/inrut-news/app/img/avatar-1.jpg',
         name: 'Югстройинвест',
         pos: 'Застройщик',
      },
   }
];

export default data;
