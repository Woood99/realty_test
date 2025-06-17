import React, { memo, useEffect, useState } from 'react';
import { sendPostRequest } from '../../../api/requestsApi';
import { ThumbPhoto } from '../../../ui/ThumbPhoto';
import getSrcImage from '../../../helpers/getSrcImage';
import { TagCashback } from '../../../ui/Tag';
import numberReplace from '../../../helpers/numberReplace';
import Button from '../../../uiForm/Button';
import { RoutesPath } from '../../../constants/RoutesPath';
import { IconArrowY, IconClose } from '../../../ui/Icons';
import getApartmentsPlayer from './getApartmentsPlayer';
import { useSelector } from 'react-redux';
import { getIsDesktop } from '../../../redux/helpers/selectors';
import cn from 'classnames';
import { Swiper, SwiperSlide } from 'swiper/react';

const PlayerCardsDynamic = memo(({ data, variant = 'short', maxLength = 35, player }) => {
   const [cards, setCards] = useState({
      items: [],
   });

   const [isActive, setIsActive] = useState(false);
   const isDesktop = useSelector(getIsDesktop);

   useEffect(() => {
      if (!data.cards.length) return;
      getApartmentsPlayer(data.cards, maxLength).then(res => {
         setCards(res);
      });
   }, []);

   useEffect(() => {
      setTimeout(() => {
         setIsActive(true);
      }, 250);
   }, []);

   if (variant === 'short') {
      return (
         <>
            <div
               className={`overflow-hidden mmd1:bg-pageColor mmd1:rounded-xl video-player-sidebar-dynamic mmd1:h-full ${
                  isDesktop
                     ? 'absolute top-8 bottom-8 -left-[360px] w-[360px] rounded-tr-none rounded-br-none rounded-br-x'
                     : 'mmd1:!-translate-x-4 rounded-tl-none rounded-bl-none rounded-br-x md1:!rounded-none'
               } ${isActive ? '_active' : ''}`}>
               {isDesktop && (
                  <div className="mmd1:py-4 px-4 flex justify-between gap-4">
                     <h3 className="title-3">Квартиры этого обзора</h3>
                     <button
                        onClick={() => {
                           setIsActive(false);
                        }}>
                        <IconClose />
                     </button>
                  </div>
               )}
               <div className="mt-1 md1:mt-0 mmd1:pb-[100px] px-4 h-full">
                  <div className="overflow-y-auto overflow-x-hidden md1:!overflow-hidden scrollbarPrimaryNoVisible h-full pb-[35px] scrollbarPrimaryLeft">
                     <div className="flex flex-col">
                        {cards.items.map(item => {
                           return (
                              <a
                                 href={`${RoutesPath.apartment}${item.id}`}
                                 onClick={() => {
                                    if (player) {
                                       player.pause();
                                    }
                                 }}
                                 target="_blank"
                                 key={item.id}
                                 className="relative group mb-4 pb-4 border-bottom-primary100 [&:last-child]:!mb-0 [&:last-child]:!pb-0 [&:last-child]:!border-none cursor-pointer flex gap-4 items-center">
                                 <div className="flex gap-4 group-hover:translate-x-2 transition-all">
                                    <ThumbPhoto>
                                       <img src={getSrcImage(item.images[0])} width={60} height={60} alt="" />
                                    </ThumbPhoto>
                                    <div className="mt-2">
                                       <h3 className="title-4">{item.title}</h3>
                                       <h4 className="title-4 mt-2">{numberReplace(item.price)} ₽</h4>
                                       <div className="mt-2">
                                          {item.cashback ? <TagCashback cashback={(item.price / 100) * item.cashback} /> : ''}
                                       </div>
                                    </div>
                                 </div>
                                 <IconArrowY
                                    className="ml-auto fill-dark -rotate-90 group-hover:translate-x-1 transition-all"
                                    width={28}
                                    height={28}
                                 />
                              </a>
                           );
                        })}
                     </div>
                  </div>
               </div>
               {isDesktop && (
                  <div className="absolute bottom-4 left-0 px-4 z-[99] w-full">
                     <Button
                        className="w-full"
                        size="Small"
                        onClick={() => {
                           if (player) {
                              player.pause();
                           }
                           window.open(`${RoutesPath.listingFlats}?complex=${data.building_id}&ids=1&${data.cards.map(id => `id=${id}`).join('&')}`);
                        }}>
                    Смотреть все квартиры
                     </Button>
                  </div>
               )}
            </div>
            {!isDesktop && (
               <div className="absolute bottom-4 left-0 px-4 z-[99] w-full md1:bg-white md1:!bottom-0 md1:py-3">
                  <Button
                     className="w-full"
                     size="Small"
                     onClick={() => {
                        if (player) {
                           player.pause();
                        }
                        window.open(`${RoutesPath.listingFlats}?complex=${data.building_id}&ids=1&${data.cards.map(id => `id=${id}`).join('&')}`);
                     }}>
                   Смотреть все квартиры
                  </Button>
               </div>
            )}
         </>
      );
   }

   if (variant === 'page') {
      return (
         <div className="white-block-small mt-3">
            <h3 className="title-3 mb-4">Квартиры этого обзора</h3>
            <Swiper
               slidesPerView={1.2}
               spaceBetween={16}
               className="w-full"
               breakpoints={{
                  799: {
                     slidesPerView: 2,
                  },
                  1222: {
                     slidesPerView: 3,
                  },
               }}>
               {cards.items.map(item => {
                  return (
                     <SwiperSlide key={item.id}>
                        <a
                           href={`${RoutesPath.apartment}${item.id}`}
                           onClick={() => {
                              if (player) {
                                 player.pause();
                              }
                           }}
                           target="_blank"
                           className="relative  flex gap-4 items-center">
                           <div className="flex gap-4">
                              <ThumbPhoto>
                                 <img src={getSrcImage(item.images[0])} width={60} height={60} alt="" />
                              </ThumbPhoto>
                              <div className="mt-2">
                                 <h3 className="title-4">{item.title}</h3>
                                 <h4 className="title-4 mt-2">{numberReplace(item.price)} ₽</h4>
                                 <div className="mt-2">{item.cashback ? <TagCashback cashback={(item.price / 100) * item.cashback} /> : ''}</div>
                              </div>
                           </div>
                           <IconArrowY className="ml-auto fill-dark -rotate-90 group-hover:translate-x-1 transition-all" width={28} height={28} />
                        </a>
                     </SwiperSlide>
                  );
               })}
            </Swiper>
            <Button
               className="w-full mt-6 md1:mt-4"
               size="Small"
               onClick={() => {
                  if (player) {
                     player.pause();
                  }
                  window.open(`${RoutesPath.listingFlats}?complex=${data.building_id}&ids=1&${data.cards.map(id => `id=${id}`).join('&')}`);
               }}>
               Смотреть все квартиры
            </Button>
         </div>
      );
   }
});

export default PlayerCardsDynamic;
