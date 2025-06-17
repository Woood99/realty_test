const building = {
   id: 1,
   title: 'ЖК “Новое Внуково”',
   cashback: 110000,
   present: false,
   top: 5,
   tags: ['Тег 1', 'Очень длинный тег'],
   address: 'Краснодар, ул.Карла-Маркса., 234',
   metro: [
      {
         name: 'Станция1',
         time: 60000, // 1м
      },
   ],
   minPrice: 2400000,
   minPricePerMeter: 94742,
   attributes: [
      {
         tabName: '',
         items: [
            {
               name: 'Срок сдачи',
               value: '3 кв. 2025 - 4 кв. 2026',
            },
            {
               name: 'Класс жилья',
               value: 'Комфорт',
            },
            {
               name: 'Тип жилья',
               value: 'Квартиры',
            },
            {
               name: 'Этажность',
               value: 'от 9 до 20',
            },
            {
               name: 'Варианты отделки',
               value: 'Без отделки, черновая, чистовая',
            },
            {
               name: 'Количество корпусов',
               value: '48',
            },
         ],
      },
      {
         tabName: 'На территории жилого комплекса',
         items: [
            {
               name: 'Школа',
               value: 'Строиться',
            },
            {
               name: 'Детский сад',
               value: 'Есть',
            },
            {
               name: 'Поликлиника',
               value: 'Есть',
            },
            {
               name: 'Детские площадки',
               value: 'Есть',
            },
         ],
      },
      {
         tabName: 'Парковка',
         items: [
            {
               name: 'Подземная',
               value: '28 места',
            },
            {
               name: 'Гостевая',
               value: '24 места',
            },
         ],
      },
   ],
   developer: {
      avatarUrl: 'https://woood99.github.io/inrut-news/app/img/samolet.png',
      name: 'ГК Самолет',
      pos: 'Застройщик',
      underСonstruction: 11, // Строиться
      handedOver: 120, // сдано
   },
   apartmentsLastUpdate: '29.07.2024',
   apartments: [
      {
         room: 0,
         minArea: 42,
         minPrice: 5000000,
         totalLayout: 380,
         totalApartment: 5,

         layouts: [
            {
               image: 'https://selcdn.trendagent.ru/images/l/b/aeghnzkycpmr6hx61buykfak.png',
               totalApartment: 5,
               minPrice: 3297000,
               minArea: 29.2,
               floors: [1, 5, 6, 7, 8, 9, 22, 23, 25, 26, 29, 29],
               frame: 'Литер 1',
               deadline: '4 кв. 2024',
               layoutItems: [
                  {
                     id: 1,
                     image: 'https://selcdn.trendagent.ru/images/x/0/2kuv0r4841cdey0vgp24blpn.png',
                     oldPrice: 3250000,
                     price: 2950000,
                     area: 53,
                     floor: '4/12',
                     frame: 'Литер 1',
                     deadline: '4 кв. 2024',

                     cashback: 5000,
                     present: true,
                     top: 5,
                     tags: ['Тег 1'],
                     discount: {
                        prc: 14,
                        validUntil: '04.12.2024',
                     },
                  },
                  {
                     id: 2,
                     image: 'https://selcdn.trendagent.ru/images/x/0/2kuv0r4841cdey0vgp24blpn.png',
                     oldPrice: 3250000,
                     price: 2950000,
                     area: 53,
                     floor: '4/12',
                     frame: 'Литер 1',
                     deadline: '4 кв. 2024',

                     cashback: 5000,
                     present: true,
                     top: 5,
                     tags: ['Тег 1'],
                     discount: {
                        prc: 14,
                        validUntil: '04.12.2024',
                     },
                  },
               ],
            },
         ],
      },
   ],
   description: [
      'Жилой комплекс состоит из 4 корпусов, в каждом из которых установлены современные лифты. На цокольном этаже расположены кладовые и коммерческие помещения.',
      'В проекте предложено множество планировочных решений: в наличии квартиры, как классического типа, так и европланировки. Площадь квартир от 30,8 до 75,9 кв. метров. Сдаются они с подчистовой отделкой и высотой потолков 2,7 метра.',
      'На территории жилого комплекса есть паркинг, детские и спортивные площадки, зоны для отдыха.',
      'Жилой комплекс комфорт-класса расположен на берегу озера, в динамично развивающемся районе Гидростроителей города Краснодара. В шаговой доступности от комплекса находится супермаркет, несколько школ и детских садов, поликлиники, парк и спортивный комплекс. В 5 минутах ходьбы от Жилого комплекса расположена автобусная остановка.',
   ],
   location: [55.76, 37.64],
   gallery: [
      {
         name: 'Дом',
         images: [
            'https://selcdn.trendagent.ru/images/61/fd/ba950fdf6a24e988b08b3486d545677a.jpg',
            'https://selcdn.trendagent.ru/images/9c/lz/5ed6c59c1458fb40401af8cf4e530d03.jpg',
            'https://selcdn.trendagent.ru/images/ne/uo/61c65acb4f12bc7182e4ea63c9c84a70.jpg',
         ],
      },
      {
         name: 'Территория',
         images: ['https://woood99.github.io/inrut-news/app/img/card-9.webp', 'https://woood99.github.io/inrut-news/app/img/card-14.webp'],
      },
      {
         name: 'Дом99',
         images: ['https://woood99.github.io/inrut-news/app/img/card-10.webp'],
      },
   ],
   stock: [
      {
         id: 1,
         name: 'Скидка 1%',
         descr: 'Скидка на квартиру 1% при брони в день показа.',
         image: 'https://woood99.github.io/inrut-news/app/img/card-9.webp',
      },
      {
         id: 2,
         name: 'Скидка 5%',
         descr: 'Скидка на квартиру 1% при брони в день показа.',
         image: 'https://woood99.github.io/inrut-news/app/img/card-5.webp',
      },
   ],
   calculations: [
      {
         id: 1,
         name: 'Продажа от застройщика. В ипотеку от 13 000 ₽ в месяц.',
         descr: 'Панорамное остекление. Гардеробная.Предчиствая отделка.',
         image: 'https://woood99.github.io/inrut-news/app/img/image-5.webp',
      },
   ],
   videos: [
      // ?
   ],
   apartmentRenov: [
      {
         name: 'White box',
         price: 500000,
         description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, omnis.',
         images: [
            'https://woood99.github.io/inrut-news/app/img/card-10.webp',
            'https://woood99.github.io/inrut-news/app/img/object-apart-renov-1.webp',
         ],
      },
      {
         name: 'Без стен',
         images: ['https://woood99.github.io/inrut-news/app/img/card-8.webp'],
      },
   ],

   ecologyParks: [
      {
         name: 'Фестивальный парк',
         description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, omnis.',
         distance: 21,
         images: [
            'https://woood99.github.io/inrut-news/app/img/photo-11.webp',
            'https://woood99.github.io/inrut-news/app/img/object-apart-renov-1.webp',
         ],
      },
   ],

   constructProgress: [
      {
         id: 1,
         complex: 'Литер 1',
         year: 2024,
         quarter: 2,
         lastUpdate: '27.02.2023',
         images: [
            'https://woood99.github.io/inrut-news/app/img/card-2.webp',
            'https://selcdn.trendagent.ru/images/9c/lz/5ed6c59c1458fb40401af8cf4e530d03.jpg',
         ],
         videos: [
            // ?
         ],
      },
      {
         id: 1,
         complex: 'Литер 2',
         year: 2023,
         quarter: 3,
         lastUpdate: '27.03.2024',
         images: ['https://woood99.github.io/inrut-news/app/img/card-2.webp'],
         videos: [
            // ?
         ],
      },
   ],
};

export const apartmentsFilterRooms = {
   name: 'rooms',
   type: 'rooms',
   options: [
      { value: 0, label: 'Студия' },
      { value: 1, label: '1' },
      { value: 2, label: '2' },
      { value: 3, label: '3' },
      { value: 4, label: '4+' },
   ],
   value: [],
};

export const apartmentsFilterPrice = {
   name: 'price',
   type: 'field-fromTo',
   postfix: '₽',
   from: {
      name: 'priceFrom',
      label: 'Цена от',
   },
   to: {
      name: 'priceTo',
      label: 'До',
   },
   value: {},
};

export const apartmentsAdditionalFilters = [
   {
      name: 'area',
      nameLabel: 'Площадь',
      type: 'field-fromTo',
      postfix: 'м²',
      from: {
         name: 'areaFrom',
         label: 'От',
      },
      to: {
         name: 'areaTo',
         label: 'До',
      },
      value: {},
   },
];

export const constructProgressFilters = [
   {
      name: 'frame',
      nameLabel: 'Весь ЖК',
      type: 'list-single',
      options: [
         { value: 'liter1', label: 'Литер 1' },
         { value: 'liter2', label: 'Литер 2' },
         { value: 'liter3', label: 'Литер 3' },
         { value: 'liter4', label: 'Литер 4' },
      ],
      value: {},
   },
   {
      name: 'year',
      nameLabel: 'Год',
      type: 'list-single',
      options: [
         { value: '2022', label: '2022' },
         { value: '2023', label: '2023' },
         { value: '2024', label: '2024' },
      ],
      value: {},
   },
   {
      name: 'quarter',
      nameLabel: 'Квартал',
      type: 'list-single',
      options: [
         { value: 'quarter1', label: '1 квартал' },
         { value: 'quarter2', label: '2 квартал' },
         { value: 'quarter3', label: '3 квартал' },
         { value: 'quarter4', label: '4 квартал' },
      ],
      value: {},
   },
];

export default building;