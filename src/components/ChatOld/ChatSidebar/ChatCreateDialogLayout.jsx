import React, { useCallback, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import debounce from 'lodash.debounce';

import { ControllerFieldSelect } from '../../../uiForm/ControllerFields/ControllerFieldSelect';
import { ControllerFieldInput } from '../../../uiForm/ControllerFields/ControllerFieldInput';
import WebSkeleton from '../../../ui/Skeleton/WebSkeleton';
import Avatar from '../../../ui/Avatar';
import PaginationPage from '../../Pagination';
import EmptyBlock from '../../EmptyBlock';
import { sendPostRequest } from '../../../api/requestsApi';
import { getCitiesValuesSelector, getCurrentCitySelector } from '../../../redux/helpers/selectors';
import Modal from '../../../ui/Modal';
import { capitalizeWords } from '../../../helpers/changeString';

const ChatCreateDialogLayout = ({ options, condition, set }) => {
   const { control, setValue } = useForm();
   const currentCity = useSelector(getCurrentCitySelector);
   const citiesData = useSelector(getCitiesValuesSelector);

   const [isLoading, setIsLoading] = useState(true);
   const [currentPage, setCurrentPage] = useState(1);
   const watchedValues = useWatch({
      control,
   });
   const [dataItems, setDataItems] = useState({
      total: 0,
   });

   const handleSubmitFn = data => {
      setIsLoading(true);
      sendPostRequest(options.api, { ...data, page: data.page }).then(res => {
         setIsLoading(false);
         setDataItems(res.data);
      });
   };

   const debounceFn = useCallback(
      debounce(state => {
         handleSubmitFn(state);
      }, 400),
      []
   );

   useEffect(() => {
      debounceFn({
         city: watchedValues.city?.value,
         search: watchedValues.search,
         page: currentPage,
      });
   }, [currentPage]);

   useEffect(() => {
      setCurrentPage(1);
      debounceFn({
         city: watchedValues.city?.value || currentCity.id,
         search: watchedValues.search,
         page: 1,
      });
   }, [watchedValues]);

   return (
      <Modal
         options={{ overlayClassNames: '_left', modalClassNames: 'mmd1:!w-[600px]', modalContentClassNames: 'md1:flex md1:flex-col !px-0' }}
         condition={condition}
         set={set}>
         <div className="grid grid-cols-2 gap-2 px-6">
            <ControllerFieldSelect
               name="city"
               nameLabel="Город"
               control={control}
               setValue={setValue}
               options={citiesData}
               defaultValue={currentCity.id ? { value: currentCity.id, label: currentCity.name } : {}}
            />
            <ControllerFieldInput control={control} name="search" placeholder={options.inputPlaceholder} />
         </div>
         <div className="mt-4">
            {!Boolean(!isLoading && dataItems.items?.length === 0) ? (
               <>
                  <div className="flex flex-col">
                     {isLoading
                        ? [...new Array(8)].map((_, index) => {
                             return (
                                <div key={index} className="py-2 px-6">
                                   <div className="flex items-center gap-3 w-full">
                                      <WebSkeleton className="w-[40px] h-[40px] rounded-full" />
                                      <WebSkeleton className="w-2/6 h-6 rounded-lg" />
                                   </div>
                                </div>
                             );
                          })
                        : dataItems.items?.map((item, index) => {
                             return (
                                <button
                                   type="button"
                                   key={index}
                                   className="relative py-2 px-6 flex gap-3 items-center hover:bg-pageColor"
                                   onClick={() => {
                                      options.onSubmit(item);
                                   }}>
                                   <Avatar size={40} src={item.photo || item.image} title={item.name} />
                                   <h3 className="title-4">
                                      {options.type === 'specialists' ? capitalizeWords(item.name, item.surname) : item.name}
                                   </h3>
                                </button>
                             );
                          })}
                  </div>
                  <PaginationPage
                     className="mt-8 px-6"
                     currentPage={currentPage}
                     setCurrentPage={value => setCurrentPage(value)}
                     total={dataItems.pages}
                  />
               </>
            ) : (
               <EmptyBlock block={false} />
            )}
         </div>
      </Modal>
   );
};

export default ChatCreateDialogLayout;
