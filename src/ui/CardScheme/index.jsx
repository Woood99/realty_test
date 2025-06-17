import React from 'react';

import styles from './CardScheme.module.scss';
import numberReplace from '../../helpers/numberReplace';
import getSrcImage from '../../helpers/getSrcImage';
import { TagCashback, TagPresent } from '../Tag';
import Button from '../../uiForm/Button';
import {TagsMoreHeight} from '../TagsMore';

const CardScheme = ({ data, room, onClick, active }) => {
   const { image, totalApartment, deadline, floors, frame, minArea, minPrice, max_price, tags, haveGift, cashback } = data;

   return (
      <article className={`${styles.CardSchemeRoot} ${active ? styles.CardSchemeActiveRoot : ''}`} >
         <div className='CardLinkElement z-50' onClick={onClick} />
         <div className={styles.CardSchemeImage}>
            <div className={`${styles.CardSchemeImageIbg} ibg-contain`}>
               <img src={getSrcImage(image)} width={340} height={245} alt="" />
            </div>
         </div>
         <div className={styles.CardSchemeContent}>
            {Boolean(cashback || haveGift || tags) && (
               <div className='flex flex-wrap gap-4'>
                  {cashback ? <TagCashback cashback={(max_price / 100) * cashback} /> : ''}
                  {haveGift ? <TagPresent present={haveGift} title='Подарок на выбор' /> : ''}
                  {Boolean(tags?.length) && <TagsMoreHeight data={tags} className="pointer-events-none !w-auto flex-grow overflow-hidden" />}
               </div>
            )}

            <h3 className="title-3 mt-4 mb-1">от {numberReplace(minPrice || 0)} ₽</h3>
            <div className="mb-4">
               <span className="font-medium">{room === 0 ? 'Студия' : `${room}-комн.`}</span>
               <span className="font-medium"> {minArea} м² </span>
               <span>этажи: {[...new Set(floors)].join(', ')}</span>
               <div className={styles.CardSchemeAttr}>
                  {frame && <span>Корпус: {frame}</span>}
                  {deadline && <span>Срок сдачи: {deadline}</span>}
               </div>
            </div>
            <Button Selector="div" variant="secondary" size="Small" className="mt-auto">
               Выбрать из {totalApartment} квартир
            </Button>
         </div>
      </article>
   );
};

export default CardScheme;
