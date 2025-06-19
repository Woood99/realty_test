import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDebounceEffect } from 'ahooks';

import WebSkeleton from '../../../../ui/Skeleton/WebSkeleton';
import Avatar from '../../../../ui/Avatar';
import PaginationPage from '../../../Pagination';
import EmptyBlock from '../../../EmptyBlock';
import { sendPostRequest } from '../../../../api/requestsApi';
import { getCitiesValuesSelector, getCurrentCitySelector } from '../../../../redux/helpers/selectors';
import Modal from '../../../../ui/Modal';
import { capitalizeWords } from '../../../../helpers/changeString';
import Select from '../../../../uiForm/Select';
import Input from '../../../../uiForm/Input';
import RepeatContent from '../../../RepeatContent';
import Button from '../../../../uiForm/Button';
import { IconLocation } from '../../../../ui/Icons';
import CityModal from '../../../../ModalsMain/CityModal';

const ChatCreateDialogLayout = ({ options, condition, set }) => {
   const currentCity = useSelector(getCurrentCitySelector);
   const citiesData = useSelector(getCitiesValuesSelector);

   const [isLoading, setIsLoading] = useState(true);
   const [popupCityOpen, setPopupCityOpen] = useState(false);

   const [filterFields, setFilterFields] = useState({
      city: {},
      search: '',
      page: 1,
      limit: 40,
   });

   const [dataItems, setDataItems] = useState({
      total: 0,
   });

   useEffect(() => {
      if (!currentCity) return;
      setFilterFields(prev => ({ ...prev, city: { value: currentCity.id, label: currentCity.name } }));
   }, [currentCity]);

   useDebounceEffect(
      () => {
         setIsLoading(true);
         sendPostRequest(options.api, { ...filterFields, city: filterFields.city.value }).then(res => {
            setIsLoading(false);
            setDataItems(res.data);
         });
      },
      [JSON.stringify(filterFields)],
      { wait: 300 }
   );

   return (
      <Modal
         options={{ overlayClassNames: '_left', modalClassNames: 'mmd1:!w-[475px]', modalContentClassNames: 'md1:flex md1:flex-col !px-0' }}
         condition={condition}
         set={set}>
         <div className="flex gap-2 px-6">
            <Button
               variant="secondary"
               size="Small"
               className="flex items-center gap-2"
               onClick={() => {
                  setPopupCityOpen(true);
               }}>
               <IconLocation width={16} height={16} />
               <span>{filterFields.city.label || ''}</span>
            </Button>
            <div className="flex-grow">
               <Input
               search
                  placeholder={options.inputPlaceholder}
                  value={filterFields.search}
                  onChange={value => {
                     setFilterFields(prev => ({ ...prev, search: value, page: 1 }));
                  }}
               />
            </div>
         </div>
         <div className="mt-4">
            {!Boolean(!isLoading && dataItems.items?.length === 0) ? (
               <>
                  <div className="flex flex-col">
                     {isLoading ? (
                        <RepeatContent count={filterFields.limit}>
                           <div className="py-2 px-6">
                              <div className="flex items-center gap-3 w-full">
                                 <WebSkeleton className="w-[40px] h-[40px] rounded-full" />
                                 <WebSkeleton className="w-2/6 h-6 rounded-lg" />
                              </div>
                           </div>
                        </RepeatContent>
                     ) : (
                        dataItems.items?.map((item, index) => {
                           return (
                              <button
                                 type="button"
                                 key={index}
                                 className="relative py-2 px-6 flex gap-3 items-center hover:bg-pageColor"
                                 onClick={() => {
                                    options.onSubmit(item);
                                 }}>
                                 <Avatar size={40} src={item.photo || item.image} title={item.name} />
                                 <h3 className="title-4">{options.type === 'specialists' ? capitalizeWords(item.name, item.surname) : item.name}</h3>
                              </button>
                           );
                        })
                     )}
                  </div>
                  <PaginationPage
                     className="mt-8 px-6"
                     currentPage={filterFields.page}
                     setCurrentPage={value => {
                        setFilterFields(prev => ({ ...prev, page: value }));
                     }}
                     total={dataItems.pages}
                  />
               </>
            ) : (
               <EmptyBlock block={false} />
            )}
         </div>

         <CityModal
            onSubmit={city => {
               setFilterFields(prev => ({ ...prev, city: { value: city.id, label: city.name }, page: 1 }));
               setPopupCityOpen(false);
            }}
            currentCity={currentCity}
            condition={popupCityOpen}
            set={setPopupCityOpen}
         />
      </Modal>
   );
};

export default ChatCreateDialogLayout;
