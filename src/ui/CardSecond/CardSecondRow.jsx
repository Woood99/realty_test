import React, { useState } from 'react';
import styles from './CardSecondRow.module.scss';
import { TagsMoreHeight } from '../TagsMore';
import { TagCashback, TagDiscount, TagPresent, TagTop } from '../Tag';
import CardGallery from '../CardGallery';
import { BtnAction, BtnActionComparison, BtnActionFavorite } from '../ActionBtns';
import { Tooltip } from '../Tooltip';
import { IconEdit, IconLocation, IconTrash } from '../Icons';
import UserInfo from '../UserInfo';
import { PrivateRoutesPath, RoutesPath, SellerRoutesPath } from '../../constants/RoutesPath';
import numberReplace from '../../helpers/numberReplace';
import HistoryPrice from '../HistoryPrice';
import LocationModal from '../../ModalsMain/LocationModal';
import { Link } from 'react-router-dom';
import DeleteModal from '../../ModalsMain/DeleteModal';
import ModalWrapper from '../Modal/ModalWrapper';
import DeleteApartmentModal from '../../ModalsMain/DeleteApartmentModal';
import { priceByDiscountApartment } from '../../helpers/priceByDiscountApartment';
import { ElementOldPrice } from '../Elements';
import dayjs from 'dayjs';

const CardSecondRow = props => {
   const {
      images,
      name,
      address,
      history,
      user,
      developer,
      rooms,
      area,
      floor,
      price,
      priceOld,
      frame,
      deadline,
      id,
      complex,
      childrenBottom = '',
      badge,
      variant,
      geo,
      location,
      geoVisible = true,
      purchase,
      btnComparisonVisible = true,
      btnFavoriteVisible = true,
      classNameBottom = '',
      controlsAdmin,
      buildingDiscount,
      buildingCashback,
   } = props;
   const { cashback, present, top, tags, className = '' } = props;

   const [isOpenModalLocation, setIsOpenModalLocation] = useState(false);
   const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

   const title = `${rooms === 0 ? 'Студия' : `${rooms}-комн квартира`}, ${area} м², ${floor} эт.`;
   const currentUser = user || developer;

   const link = `${RoutesPath.apartment}${id}${purchase ? `?purchase=${purchase}` : ''}`;

   const classVariant = () => {
      switch (variant) {
         case '':
            return '';
         case 'shadow':
            return styles.CardSecondRowRootShadow;
         default:
            return '';
      }
   };

   const priceApartment = priceOld || price;

   const priceByDiscount = priceByDiscountApartment(buildingDiscount, priceApartment, area);
   const cashbackValue = ((priceByDiscount || priceApartment) / 100) * ((cashback || 0) + (buildingCashback?.value || 0));

   return (
      <article className={`${styles.CardSecondRowRoot} ${classVariant()} ${className}`}>
         <div className={styles.CardSecondRowContainer}>
            <a href={link} className={styles.CardSecondRowLink} />
            <CardGallery images={images} title={title} href={link} badge={badge} imageFit="contain" className={styles.CardSecondRowGallery} />
            <div className={styles.CardSecondRowWrapper}>
               <div className={styles.CardSecondRowContent}>
                  <div className="flex gap-3 justify-between mb-8 flex-grow">
                     <div className="flex flex-col">
                        <div className="title-2 mb-2">{title}</div>
                        <p className={styles.CardSecondRowName}>{name || complex}</p>
                        <p className={styles.CardSecondRowTerm}>
                           Корпус: {frame} Срок сдачи: {deadline}
                        </p>
                        <p className={styles.CardSecondRowAddress}>{address}</p>
                     </div>
                  </div>
                  <div className={styles.CardSecondRowAdd}>
                     <div className="mb-2">
                        {!priceByDiscount && <h3 className="title-2">{numberReplace(priceApartment)} ₽</h3>}
                        {priceByDiscount && (
                           <div className="flex flex-col items-start">
                              <ElementOldPrice>{numberReplace(priceApartment)} ₽</ElementOldPrice>
                              <div className="flex gap-2 items-center mb-1 mt-1">
                                 <h3 className="title-2">{numberReplace(priceByDiscount)} ₽</h3>
                              </div>
                           </div>
                        )}
                     </div>
                     {Boolean(buildingDiscount || cashbackValue || present) && (
                        <div className="flex flex-wrap gap-1.5 mb-1.5">
                           {Boolean(buildingDiscount) && (
                              <TagDiscount
                                 discount={buildingDiscount.value}
                                 type_id={buildingDiscount.type}
                                 prefix="Скидка"
                                 tooltip
                                 start_date={dayjs(buildingDiscount.start_date).format('DD.MM.YYYY')}
                                 end_date={dayjs(buildingDiscount.end_date).format('DD.MM.YYYY')}
                                 unit={buildingDiscount.unit}
                              />
                           )}
                           {cashbackValue ? <TagCashback cashback={cashbackValue} prefix="Кешбэк" /> : ''}
                           {present && <TagPresent present={present} />}
                        </div>
                     )}
                     {Boolean(tags?.length) && (
                        <div className="mb-3 flex flex-wrap gap-1.5 w-full">
                           <TagsMoreHeight data={tags} increaseHeight />
                        </div>
                     )}
                  </div>
                  <div className="ml-auto flex flex-col gap-2">
                     {!controlsAdmin ? (
                        <>
                           {btnComparisonVisible && <BtnActionComparison id={id} type="apartment" variant="tooltip" placement="left" />}
                           {btnFavoriteVisible && <BtnActionFavorite id={id} type="apartment" variant="tooltip" placement="left" />}
                           {geoVisible && (
                              <Tooltip
                                 placement="left"
                                 offset={[10, 5]}
                                 ElementTarget={() => (
                                    <BtnAction className="relative z-50" onClick={() => setIsOpenModalLocation(true)}>
                                       <IconLocation width={15} height={15} className="pointer-events-none" />
                                    </BtnAction>
                                 )}>
                                 Показать на карте
                              </Tooltip>
                           )}
                        </>
                     ) : (
                        <>
                           <Tooltip
                              placement="left"
                              offset={[10, 5]}
                              ElementTarget={() => (
                                 <Link to={`${PrivateRoutesPath.apartment.edit}${id}`} target="_blank">
                                    <BtnAction Selector="div" className="relative z-50">
                                       <IconEdit className="stroke-blue stroke-[1.5px]" width={18} height={18} />
                                    </BtnAction>
                                 </Link>
                              )}>
                              Редактировать
                           </Tooltip>
                           <Tooltip
                              placement="left"
                              offset={[10, 5]}
                              ElementTarget={() => (
                                 <BtnAction className="relative z-50" onClick={() => setConfirmDeleteModal(id)}>
                                    <IconTrash className="fill-red" width={16} height={16} />
                                 </BtnAction>
                              )}>
                              Удалить
                           </Tooltip>
                        </>
                     )}
                  </div>
               </div>
               {currentUser && (
                  <div className={`${styles.CardSecondRowBottom} ${classNameBottom}`}>
                     <UserInfo avatar={currentUser.avatarUrl} name={currentUser.name} pos={currentUser.pos} />
                     {childrenBottom}
                  </div>
               )}
            </div>
         </div>
         <LocationModal condition={isOpenModalLocation} set={setIsOpenModalLocation} geo={geo || location} />
         <DeleteApartmentModal
            options={{
               condition: confirmDeleteModal,
               set: setConfirmDeleteModal,
               title: (
                  <>
                     <br /> {title}
                  </>
               ),
               redirectUrl: false,
            }}
         />
      </article>
   );
};

export default CardSecondRow;
