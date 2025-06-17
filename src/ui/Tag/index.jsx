import React from 'react';
import cn from 'classnames';

import styles from './Tag.module.scss';
import numberReplace from '../../helpers/numberReplace';

import presentImg from '../../assets/img/present.png';
import { Tooltip } from '../Tooltip';
import { IconInfoTooltip, IconLightning } from '../Icons';
import { RoutesPath } from '../../constants/RoutesPath';
import { ExternalLink } from '../ExternalLink';

import CROWN_IMAGE from '../../assets/img/crown.png';

const Tag = ({
   size = 'default',
   color = 'default',
   children,
   childrenRoot,
   onClick = () => {},
   value,
   className = '',
   tagObj = {},
   hoverEnable,
   disabled = false,
}) => {
   let isActive = Boolean(value);
   const onClickHandler = () => {
      onClick(!isActive);
   };

   const currentSizeClass = () => {
      switch (size) {
         case 'small':
            return styles.TagSmall;
         case 'medium':
            return styles.TagMediumSize;
         case 'big':
            return styles.TagBig;
         default:
            return '';
      }
   };

   const currentColorClass = () => {
      switch (color) {
         case 'default':
            return '';
         case 'green':
            return styles.TagGreen;
         case 'green-second':
            return styles.TagGreenSecond;
         case 'aqua':
            return styles.TagAqua;
         case 'red':
            return styles.TagRed;
         case 'yellow':
            return styles.TagYellow;
         case 'purple':
            return styles.TagPurple;
         case 'darkGreen':
            return styles.TagDarkGreen;
         case 'blue':
            return styles.TagBlue;
         case 'select':
            return styles.TagSelect;
         case 'white':
            return styles.TagWhite;
         case 'choice':
            return styles.TagChoice;
         default:
            return '';
      }
   };

   if (tagObj && tagObj.link) {
      return (
         <Tooltip
            mobile
            color="white"
            ElementTarget={() => (
               <button
                  type="button"
                  onClick={onClickHandler}
                  className={cn(
                     'relative z-[99]',
                     styles.Tag,
                     styles.TagHoverEnable,
                     currentSizeClass(),
                     currentColorClass(),
                     isActive && color === 'choice' ? styles.TagChoiceActive : styles.TagActive,
                     className
                  )}>
                  <div className={`${tagObj.link ? 'flex !items-center gap-1' : ''}`}>
                     {children}
                     {Boolean(tagObj.link) && <IconInfoTooltip width={14} height={14} />}
                  </div>
               </button>
            )}>
            <div className="pr-8 flex flex-col items-start gap-2">
               {tagObj.name}
               <a href={tagObj.link} target="_blank" className="blue-link">
                  Подробнее
               </a>
            </div>
         </Tooltip>
      );
   } else {
      return (
         <button
            type="button"
            onClick={onClickHandler}
            className={cn(
               'relative z-[99]',
               styles.Tag,
               hoverEnable && styles.TagHoverEnable,
               currentSizeClass(),
               currentColorClass(),
               isActive && styles.TagActive,
               className,
               disabled && styles.TagDisabled
            )}>
            <div>{children}</div>
            {childrenRoot}
         </button>
      );
   }
};

export const TagCashback = ({ cashback = '', prefix = 'Кешбэк до', increased }) => {
   if (!cashback) return;
   return (
      <Tooltip
         mobile
         ElementTarget={() => (
            <Tag
               size="small"
               color="green"
               childrenRoot={
                  <>
                     {Boolean(increased) && (
                        <img src={CROWN_IMAGE} width={25} height={25} className="absolute -top-4 right-1/2 translate-x-1/2" alt="Повышенный кешбэк" />
                     )}
                  </>
               }>
               {prefix} {numberReplace(cashback)} ₽
            </Tag>
         )}
         classNameContent="mmd1!p-6"
         placement="bottom">
         <h3 className="title-3-5 !text-white md1:!text-dark">Кешбэк за покупку объекта</h3>
         <p className="mt-2">Начислим наличными за покупку на банковскую карту.</p>
         <ExternalLink to={RoutesPath.cashbackConditions} className="blue-link font-medium mt-2.5">
            Условия акции «Кешбэк»
         </ExternalLink>
      </Tooltip>
   );
};

export const TagPresent = ({ present = '', title = 'Подарок' }) => {
   return (
      present && (
         <Tag size="small" color="purple">
            <span className="flex items-center gap-2 w-max">
               <img src={presentImg} width={15} height={15} alt="Подарок" />
               {title}
            </span>
         </Tag>
      )
   );
};

export const TagPresents = ({ dataMainGifts = [], dataSecondGifts = [], title = 'Подарки', secondTitle = null }) => {
   const data = [...dataMainGifts, ...dataSecondGifts];
   if (!data.length) return;

   return (
      <Tooltip mobile color="dark" ElementTarget={() => <TagPresent present title={title} />}>
         <div className="mmd1:pr-8 flex flex-col items-start gap-4">
            {Boolean(dataMainGifts.length) && (
               <div>
                  <p className="font-medium mb-2">Гарантированные подарки:</p>
                  <div className="flex flex-col items-start gap-2">
                     {dataMainGifts.map((tag, index) => (
                        <Tag size="small" key={index}>
                           {tag}
                        </Tag>
                     ))}
                  </div>
               </div>
            )}
            {Boolean(dataSecondGifts.length) && (
               <div>
                  <p className="font-medium mb-2">Подарки на выбор:</p>
                  <div className="flex flex-col items-start gap-2 ">
                     {dataSecondGifts.map((tag, index) => (
                        <Tag size="small" key={index}>
                           {tag}
                        </Tag>
                     ))}
                  </div>
               </div>
            )}
         </div>
      </Tooltip>
   );
};

export const TagTop = ({ top = '' }) => {
   return (
      top && (
         <Tag size="small" color="aqua">
            {top}
         </Tag>
      )
   );
};

export const TagDiscount = ({
   discount = '',
   type = 'prc',
   type_id = 1,
   prefix = 'вам',
   suffix = '',
   tooltip = false,
   start_date,
   end_date,
   unit,
   building_info = false,
   timer = false,
}) => {
   const typeName = type_id ? (type_id === 1 ? 'prc' : 'cash') : type;

   if (!Boolean(discount)) return;

   if (tooltip && start_date && end_date && unit) {
      return (
         <Tooltip
            mobile
            ElementTarget={() => (
               <Tag size="small" color="yellow">
                  <div className="flex items-center gap-1">
                     <IconLightning width={12} height={12} />
                     {prefix}
                     <span>
                        -{numberReplace(discount)} {typeName === 'prc' ? '%' : '₽'}
                     </span>
                     {Boolean(unit === 2) && <span className="-ml-1">/м²</span>}
                     {suffix}
                     {Boolean(timer) && <div>| 3д. 12ч. 57 мин.</div>}
                     <IconInfoTooltip width={16} height={16} className="!stroke-[#bc9829]" />
                  </div>
               </Tag>
            )}>
            <div className="font-medium text-center">
               {building_info ? (
                  <>
                     Скидка {numberReplace(discount)} {typeName === 'prc' ? '%' : '₽'} на определённые квартиры <br />
                     Действует с {start_date} до {end_date}
                  </>
               ) : (
                  <>
                     Скидка действует с {start_date} <br /> до {end_date} на данную квартиру
                  </>
               )}
            </div>
         </Tooltip>
      );
   } else {
      return (
         <Tag size="small" color="yellow">
            <div className="flex items-center gap-1">
               {prefix}
               <span>
                  {numberReplace(discount)} {typeName === 'prc' ? '%' : '₽'}
               </span>
            </div>
         </Tag>
      );
   }
};

export default Tag;
