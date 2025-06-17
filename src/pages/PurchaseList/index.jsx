import React from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { PurchaseListContext } from '../../context';
import CardBasicRowSkeleton from '../../components/CardBasicRowSkeleton';
import PaginationPage from '../../components/Pagination';
import { CardRowPurchaseBasic } from '../../ui/CardsRow';
import WebSkeleton from '../../ui/Skeleton/WebSkeleton';
import { RoutesPath, SellerRoutesPath } from '../../constants/RoutesPath';
import MainLayout from '../../layouts/MainLayout';
import Header from '../../components/Header';
import PurchaseListForm from './PurchaseListForm';
import { getCitiesValuesSelector } from '../../redux/helpers/selectors';
import { ROLE_BUYER } from '../../constants/roles';
import RepeatContent from '../../components/RepeatContent';
import EmptyBlock from '../../components/EmptyBlock';
import { usePurchaseList } from './usePurchaseList';

const PurchaseList = ({ role_id = ROLE_BUYER.id }) => {
   const cities = useSelector(getCitiesValuesSelector);

   const {
      data,
      filterCount,
      isOpenMoreFilter,
      setIsOpenMoreFilter,
      currentCity,
      control,
      reset,
      types,
      setDevelopers,
      developers,
      complexes,
      setComplexes,
      setValue,
      watchedValues,
      initFieldsForm,
      setInitFieldsForm,
      userIsSeller,
      isLoading,
      currentPage,
      setCurrentPage,
   } = usePurchaseList(role_id);

   return (
      <MainLayout
         helmet={
            <Helmet>
               <title>Заявки на покупку</title>
               <meta name="description" content="Добро пожаловать на сайт inrut.ru" />;
               <meta name="description" content="На inrut.ru вы можете решить любой вопрос с недвижимостью" />;
            </Helmet>
         }>
         <PurchaseListContext.Provider
            value={{
               filterCount,
               isOpenMoreFilter,
               setIsOpenMoreFilter,
               currentCity,
               cities,
               control,
               reset,
               types,
               setDevelopers,
               developers,
               complexes,
               setComplexes,
               setValue,
               watchedValues,
               initFieldsForm,
               setInitFieldsForm,
            }}>
            <Header />
            <main className="main">
               <div className="main-wrapper">
                  <div className="container-desktop">
                     <div className="white-block">
                        <h2 className="title-2 mb-6">Заявки на покупку</h2>
                        <PurchaseListForm />
                     </div>

                     <div className="mt-3">
                        <div className="flex flex-col white-block !px-0 !py-5 md1:!py-3 ">
                           {isLoading ? (
                              <RepeatContent count={8}>
                                 <CardBasicRowSkeleton className="grid-cols-[700px_160px] h-[135px] !shadow-none mmd1:justify-between  md1:flex md1:flex-col md1:gap-3 md1:items-start">
                                    <WebSkeleton className="h-10 md1:w-3/4 rounded-lg" />
                                    <WebSkeleton className="h-10 md1:w-3/4 rounded-lg" />
                                 </CardBasicRowSkeleton>
                              </RepeatContent>
                           ) : (
                              <>
                                 {data.items?.length ? (
                                    <>
                                       {data.items.map((item, index) => (
                                          <CardRowPurchaseBasic
                                             classNameContent="mmd1:grid mmd1:grid-cols-[940px_max-content]"
                                             className="py-5 px-8"
                                             data={{ ...item, current_type: types.find(type => type.value === item.type) }}
                                             key={index}
                                             href={`${userIsSeller ? `${SellerRoutesPath.purchase.inner}` : `${RoutesPath.purchase.inner}`}${
                                                item.id
                                             }`}
                                          />
                                       ))}
                                    </>
                                 ) : (
                                    <EmptyBlock block={false} />
                                 )}
                              </>
                           )}
                        </div>
                        <PaginationPage
                           className="mt-8"
                           currentPage={currentPage}
                           setCurrentPage={value => setCurrentPage(value)}
                           total={data.pages}
                        />
                     </div>
                  </div>
               </div>
            </main>
         </PurchaseListContext.Provider>
      </MainLayout>
   );
};

export default PurchaseList;
