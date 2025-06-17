import React, { useContext } from 'react';
import { ApartmentContext } from '../../../context';
import { TagCashback, TagDiscount, TagPresent } from '../../../ui/Tag';
import numberReplace from '../../../helpers/numberReplace';
import HistoryPrice from '../../../ui/HistoryPrice';
import { ROLE_SELLER } from '../../../constants/roles';
import { priceByDiscountApartment } from '../../../helpers/priceByDiscountApartment';
import { ElementOldPrice } from '../../../ui/Elements';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { getIsDesktop } from '../../../redux/helpers/selectors';

const ApartmentPrice = ({ className = '' }) => {
   const {
      priceOld,
      area,
      historyPrice,
      myDiscount,
      history_price_old,
      userRole,
      purchaseId,
      buildingDiscount,
      cashbackValue,
      buildingCashback,
      priceByDiscount,
      present,
   } = useContext(ApartmentContext);

   const isDesktop = useSelector(getIsDesktop);

   return (
      <div className={className}>
         {Boolean(history_price_old !== priceOld || myDiscount) && (
            <div className="flex gap-3 mb-1">
               {!Boolean(userRole === ROLE_SELLER.name && purchaseId) && (
                  <>{myDiscount && <TagDiscount discount={myDiscount.discount} type={myDiscount.type} />}</>
               )}
            </div>
         )}

         <div>
            <div className="flex items-center gap-4">
               {!priceByDiscount && <h2 className="title-1">{numberReplace(priceOld)} ₽</h2>}
               {priceByDiscount && (
                  <div className="flex gap-4 items-center">
                     <h2 className="title-2">{numberReplace(priceByDiscount)} ₽</h2>
                     <ElementOldPrice>{numberReplace(priceOld)} ₽</ElementOldPrice>
                  </div>
               )}

               {/* {historyPrice && historyPrice.length > 0 ? <HistoryPrice data={historyPrice} className="z-50 relative" /> : ''} */}
            </div>
            {/* <span className="text-primary400 mt-2 block">{numberReplace(parseInt(priceOld / area))} ₽/м²</span> */}
            {isDesktop && (
               <>
                  {Boolean(buildingDiscount || cashbackValue) && (
                     <div className="flex flex-wrap gap-2 mt-4">
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
                        {Boolean(cashbackValue) && <TagCashback cashback={cashbackValue} prefix="Кешбэк" increased={Boolean(buildingCashback)} />}
                        {present && <TagPresent present={present} />}
                     </div>
                  )}
               </>
            )}
         </div>
      </div>
   );
};

export default ApartmentPrice;
