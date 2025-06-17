import React, { useState } from 'react';
import { TagCashback, TagPresent, TagTop } from '../Tag';
import MetroItems from '../MetroItems';
import numberReplace from '../../helpers/numberReplace';
import Button from '../../uiForm/Button';
import { Link } from 'react-router-dom';
import { RoutesPath } from '../../constants/RoutesPath';
import { BtnAction, BtnActionComparison, BtnActionFavorite } from '../ActionBtns';
import UserInfo from '../UserInfo';
import CardGallery from '../CardGallery';
import { TagsMoreHeight } from '../TagsMore';
import { Tooltip } from '../Tooltip';
import { IconLocation } from '../Icons';
import LocationModal from '../../ModalsMain/LocationModal';
import ComplexCardInfoSkeleton from './ComplexCardInfoSkeleton';

const ComplexCardInfo = ({ data, specialists = [], loading = false }) => {
   const [isOpenModalLocation, setIsOpenModalLocation] = useState(false);

   if (loading) {
      return <ComplexCardInfoSkeleton />;
   }

   return (
      <div className="white-block-small grid grid-cols-[1fr_500px] gap-8 md1:gap-4 relative md1:flex md1:flex-col-reverse">
         <Link to={`${RoutesPath.building}${data.id}`} className="CardLinkElement" />
         <div className="flex flex-col">
            {Boolean(data.cashback || data.present || data.stickers?.length) && (
               <div className="flex gap-2 flex-wrap">
                  {data.cashback && data.max_price ? <TagCashback cashback={(data.max_price / 100) * data.cashback} /> : ''}
                  {data.present && <TagPresent present={data.present} />}
                  {Boolean(data.stickers?.length) && data.stickers.map(item => <TagTop top={item.name} key={item.id} />)}
               </div>
            )}

            {Boolean(data.tags?.length) && (
               <div className="mt-2 flex flex-wrap gap-1.5 w-full">
                  <TagsMoreHeight data={data.tags} />
               </div>
            )}
            <h2 className="title-2 mt-4 mb-2">{data.title}</h2>
            <p className="mb-1 text-primary400">Срок сдачи: {data.deadline}</p>
            <div className="mb-1">{[data.city, data.address].filter(item => item).join(', ')}</div>
            <MetroItems data={data.metro} visibleItems={99} />
            <div className="flex items-center gap-3 mt-2">
               <h3 className="title-2">от {numberReplace(data.minPrice || 0)} ₽</h3>
               <div className="text-primary500">{numberReplace(data.minPricePerMeter || 0)} ₽/м²</div>
            </div>
            <div className="mt-6 mb-3">
               <UserInfo avatar={data.developer?.avatarUrl} name={data.developer?.name} pos={data.developer?.pos} />
            </div>
            <div className="mt-auto flex gap-2 items-center">
               <Button Selector="div" variant="secondary" size="Small">
                  Подробнее о ЖК
               </Button>
               <BtnActionComparison id={data.id} type="complex" variant="tooltip" placement="bottom" className="relative z-10" />
               <BtnActionFavorite id={data.id} type="complex" variant="tooltip" placement="bottom" className="relative z-10" />
               <Tooltip
                  placement="bottom"
                  offset={[10, 5]}
                  ElementTarget={() => (
                     <BtnAction className="relative z-50" onClick={() => setIsOpenModalLocation(true)}>
                        <IconLocation width={15} height={15} className="pointer-events-none" />
                     </BtnAction>
                  )}>
                  Показать на карте
               </Tooltip>
            </div>
         </div>

         {data.gallery && (
            <CardGallery
               href={`${RoutesPath.building}${data.id}`}
               images={data.gallery?.map(item => item.images).flat()}
               title={data.title}
               className="h-full !max-h-none"
            />
         )}
         <LocationModal condition={isOpenModalLocation} set={setIsOpenModalLocation} geo={data.location} />
      </div>
   );
};

export default ComplexCardInfo;
