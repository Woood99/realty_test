import { useContext } from 'react';
import { CardPrimaryContext } from '..';
import { TagCashback, TagDiscount, TagPresents, TagTop } from '../../Tag';
import { TagsMoreHeight } from '../../TagsMore';
import { isArray } from '../../../helpers/isEmptyArrObj';
import dayjs from 'dayjs';

const CardPrimaryTagsTop = () => {
   const { cashback, max_price, present, top, main_gifts, stickers, second_gifts, buildingDiscount } = useContext(CardPrimaryContext);

   const has = Boolean((cashback && max_price) || present || top);
   const has_cashback = Boolean(cashback && max_price);
   const has_present = Boolean(main_gifts?.length || present || second_gifts?.length);
   const has_stickers = Boolean(stickers?.length);

   const cashbackValue = (max_price / 100) * cashback;

   if (!has) return;

   return (
      <div className="flex gap-1.5 flex-wrap mb-3">
         {Boolean(buildingDiscount) && (
            <TagDiscount
               discount={buildingDiscount.value}
               type_id={buildingDiscount.type}
               prefix="Скидка"
               tooltip
               start_date={dayjs(buildingDiscount.start_date).format('DD.MM.YYYY')}
               end_date={dayjs(buildingDiscount.end_date).format('DD.MM.YYYY')}
               unit={buildingDiscount.unit}
               building_info
            />
         )}
         {has_cashback && <TagCashback cashback={cashbackValue} />}
         {has_present && (
            <TagPresents
               dataMainGifts={isArray(main_gifts) ? main_gifts.filter(item => item) : []}
               dataSecondGifts={isArray(second_gifts) ? second_gifts.filter(item => item) : []}
               title="Есть подарок"
            />
         )}
         {has_stickers && (
            <div className="flex flex-wrap gap-1.5">
               <TagsMoreHeight data={[...stickers.map(item => ({ ...item, type: 'sticker' }))]} increaseHeight maxHeightDefault={50} />
            </div>
         )}

         {top && <TagTop top={top} />}
      </div>
   );
};

export default CardPrimaryTagsTop;
