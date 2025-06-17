const apartment = {
   id: 1,
   title: '1-ком. квартира, 39 м², 12/12 эт.',
   complex: 'ЖК “Новое Внуково”',
   cashback: 10000,
   present: false,
   top: 5,
   tags: ['Тег 1', 'Очень длинный тег'],
   address: 'Краснодар, ул.Карла-Маркса., 234',
   frame: 'Литер 1',
   deadline: '4 кв. 2024',
   price: 1000000,
   priceOld: 2000000,
   area: 30.1,
   attributes: [
      {
         name: 'Комнат',
         value: '2',
      },
      {
         name: 'Этаж',
         value: '16/18',
      },
      {
         name: 'Площадь',
         value: '57 м²',
      },
      {
         name: 'Жилая площадь',
         value: '15 м²',
      },
      {
         name: 'Тип',
         value: 'Квартира',
      },
      {
         name: 'Площадь кухни',
         value: '19 м²',
      },
      {
         name: 'Высота потолков',
         value: '3 м²',
      },
      {
         name: 'Санузел',
         value: 'Совмещённый',
      },
      {
         name: 'Балкон/лоджия',
         value: 'Лоджия',
      },
      {
         name: 'Отделка',
         value: 'Ремонт',
      },
   ],
   location: [45.00963912132335, 39.15492313419865],
   images: [
      'https://woood99.github.io/inrut-news/app/img/card-scheme.png',
      'https://selcdn.trendagent.ru/images/ne/uo/61c65acb4f12bc7182e4ea63c9c84a70.jpg',
      'https://selcdn.trendagent.ru/images/l/b/aeghnzkycpmr6hx61buykfak.png',
   ],
   masterSub: 2, // 2%
   presents: {
      type: 'summ',
      maxAmount: 100000,
      items: [
         {
            id: 1,
            image: 'https://woood99.github.io/inrut-news/app/img/avatar-2.jpg',
            title: 'Название подарка2',
            descr: 'Описание подарка2',
            oldPrice: 4000,
            newPrice: 0,
            details: 'Дополнительная информация1',
         },
         {
            id: 2,
            image: 'https://woood99.github.io/inrut-news/app/img/avatar-2.jpg',
            title: 'Название подарка3 412 4124 214 21 421 4214 214 214 124 214 21',
            descr: 'Описание подарка3',
            oldPrice: 99000,
            newPrice: 0,
            details: 'Дополнительная информация2',
         },
         {
            id: 3,
            image: 'https://woood99.github.io/inrut-news/app/img/avatar-2.jpg',
            title: 'Название подарка3',
            descr: 'Описание подарка3',
            oldPrice: 40000,
            newPrice: 0,
            details: 'Дополнительная информация3',
         },
         {
            id: 4,
            image: 'https://woood99.github.io/inrut-news/app/img/avatar-2.jpg',
            title: 'Название подарка4',
            descr: 'Описание подарка4',
            oldPrice: 30000,
            newPrice: 0,
         }
      ],
   },
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
   developer: {
      avatarUrl: 'https://woood99.github.io/inrut-news/app/img/samolet.png',
      name: 'ГК Самолет',
      pos: 'Застройщик',
   },
   discount: {
      prc: 0.5,
      validUntil: '13.08.2024',
   },
};

export default apartment;
