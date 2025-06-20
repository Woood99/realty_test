import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';

import BodyAndSidebar from '../../components/BodyAndSidebar';
import ApartmentSidebar from './ApartmentSidebar';
import ApartmentInfo from './ApartmentInfo';
import ApartmentPresents from './ApartmentPresents';
import BuildingMap from '../Building/BuildingMap';
import BlockPersonalDiscount from '../../components/BlockPersonalDiscount';

import RecordViewing from '../../ModalsMain/RecordViewing';
import SelectAccLogModal from '../../ModalsMain/SelectAccLogModal';
import BlockHistoryPrice from '../../components/BlockHistoryPrice';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import { ApartmentContext } from '../../context';
import MainLayout from '../../layouts/MainLayout';
import HelmetApartment from '../../Helmets/HelmetApartment';
import Header from '../../components/Header';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import BuildingSpecialists from '../Building/BuildingSpecialists';
import { FeedBlockPrimary } from '../../components/Ribbon';
import { CardRowPurchaseBasic } from '../../ui/CardsRow';
import { RoutesPath } from '../../constants/RoutesPath';
import ChoiceSpecialistForChat from '../../ModalsMain/ChoiceSpecialistForChat';
import { checkAuthUser, getIsDesktop, getUserInfo } from '../../redux/helpers/selectors';
import ParallaxComponent from '../../components/ParallaxComponent';
import { BtnActionComparison, BtnActionFavorite, BtnActionShare } from '../../ui/ActionBtns';
import ShareModal from '../../ModalsMain/ShareModal';
import FixedBlock from '../../components/FixedBlock';
import Button from '../../uiForm/Button';
import { BadgeText } from '../../ui/Badges';
import { GalleryRow } from '../../components/GalleryRow';
import { useApartment } from './useApartment';
import { useQueryParams } from '../../hooks/useQueryParams';
import { isAdmin, isSeller } from '../../helpers/utils';
import { ROLE_ADMIN, ROLE_BUYER, ROLE_SELLER } from '../../constants/roles';
import QuestionToChat from '../../components/QuestionToChat';
import AnimatedText from '../../ui/AnimatedText';
import RecordViewingSent from '../../ModalsMain/RecordViewing/RecordViewingSent';
import SuggestionsProvider from '../../components/Suggestions/SuggestionsProvider';
import { suggestionsTypes } from '../../components/Suggestions/suggestions-types';
import SuggestionsCard from '../../components/Suggestions/SuggestionsCard';
import RecordViewingContact from '../../ModalsMain/RecordViewing/RecordViewingContact';

const Apartment = ({ type }) => {
   const [cookies] = useCookies();
   const { id } = useParams();
   const isDesktop = useSelector(getIsDesktop);
   const params = useQueryParams();
   const {
      apartmentData,
      types,
      myDiscount,
      goToChat,
      purchaseRequest,
      isOpenChoiceSpecialist,
      setIsOpenChoiceSpecialist,
      specialistsData,
      apartmentSelector,
      suggestions,
      getSuggestions,
   } = useApartment(id);

   const [isOpenRecordView, setIsOpenRecordView] = useState(false);
   const [applicationSentModal, setApplicationSentModal] = useState(false);
   const [isOpenShareModal, setIsOpenShareModal] = useState(false);
   const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);

   const galleryRef = useRef(null);
   const gallerySwiperRef = useRef(null);
   const stickyHelpRef = useRef(null);

   const [userRole, setUserRole] = useState('');
   const userInfo = useSelector(getUserInfo);
   const authUser = useSelector(checkAuthUser);

   useEffect(() => {
      if (!apartmentData) return;

      if (isAdmin(userInfo)) {
         setUserRole(ROLE_ADMIN.name);
      } else if (isSeller(userInfo) && userInfo.associated_objects?.includes(+apartmentData.building_id)) {
         setUserRole(ROLE_SELLER.name);
      } else {
         setUserRole(ROLE_BUYER.name);
      }
   }, [userInfo, apartmentData]);

   if (!apartmentData) {
      return '';
   }

   return (
      <MainLayout helmet={<HelmetApartment data={apartmentData || {}} />}>
         <Header />
         <ApartmentContext.Provider
            value={{
               ...apartmentData,
               myDiscount,
               setIsOpenRecordView,
               setIsOpenChoiceSpecialist,
               setIsOpenShareModal,
               goToChat,
               userRole,
               purchaseId: params.purchase,
            }}>
            <main className={`main ${!isDesktop ? '!pb-[120px]' : ''}`}>
               <div className="main-wrapper md1:pt-0">
                  <div className="container-desktop">
                     <ParallaxComponent condition={!isDesktop} block={galleryRef.current} container={stickyHelpRef.current}>
                        {Boolean(userRole === ROLE_SELLER.name && params.purchase) && purchaseRequest && (
                           <div className="mb-3">
                              <CardRowPurchaseBasic
                                 className="mmd1:!flex"
                                 bg={true}
                                 data={{
                                    ...purchaseRequest,
                                    current_type: types.find(type => type.value === purchaseRequest.building_type_id),
                                    calc_props: purchaseRequest.pricing_attributes,
                                 }}
                                 href={`${RoutesPath.purchase.inner}${purchaseRequest.id}`}
                              />
                           </div>
                        )}
                        <BodyAndSidebar>
                           <div className="flex flex-col gap-3 min-w-0 ">
                              <section ref={galleryRef} className="md1:w-full">
                                 <div className="white-block !p-2.5">
                                    <GalleryRow
                                       imageFit="contain"
                                       dataGallery={[{ id: 2, type: 'images', images: apartmentData.images || [] }]}
                                       swiperRef={gallerySwiperRef}
                                       isOpenModal={isOpenModalGallery}
                                       setIsOpenModal={setIsOpenModalGallery}
                                       tabsMobile={false}
                                       galleryType="default"
                                    />
                                 </div>
                                 {!isDesktop && (
                                    <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                                       <BtnActionFavorite
                                          id={id}
                                          type="apartment"
                                          variant="circle"
                                          className={
                                             Boolean(userRole === ROLE_SELLER.name && params.purchase) ? 'opacity-60 pointer-events-none' : ''
                                          }
                                       />
                                       <BtnActionComparison
                                          id={id}
                                          type="apartment"
                                          variant="circle"
                                          className={
                                             Boolean(userRole === ROLE_SELLER.name && params.purchase) ? 'opacity-60 pointer-events-none' : ''
                                          }
                                       />
                                       <BtnActionShare variant="circle" set={setIsOpenShareModal} />
                                    </div>
                                 )}
                              </section>
                              {Boolean(suggestions.length) && (
                                 <SuggestionsProvider
                                    suggestions_type={suggestionsTypes.buyerAll}
                                    customUpdate={() => {
                                       getSuggestions(id);
                                    }}>
                                    {suggestions.map(card => {
                                       return (
                                          <section key={card.status_id}>
                                             <div className="white-block">
                                                <SuggestionsCard card={card} suggestions_type={suggestionsTypes.buyerAll} variant="default" />
                                             </div>
                                          </section>
                                       );
                                    })}
                                 </SuggestionsProvider>
                              )}
                              <section className="will-change-[margin-top]" ref={stickyHelpRef} style={{ marginTop: isDesktop ? 0 : 480 }}>
                                 <ApartmentInfo />
                              </section>

                              {Boolean(userRole === ROLE_BUYER.name && !params.purchase && specialistsData.length) && (
                                 <>
                                    <section className="relative z-10">
                                       <BuildingSpecialists specialists={specialistsData} building_id={apartmentData.building_id} />
                                    </section>
                                    {myDiscount &&
                                       !isEmptyArrObj(myDiscount) &&
                                       myDiscount.map(item => {
                                          return (
                                             <section key={item.id} className="relative z-10">
                                                <BlockPersonalDiscount data={item} mainData={apartmentData} variant="block" />
                                             </section>
                                          );
                                       })}
                                 </>
                              )}
                              {!isDesktop && <ApartmentSidebar />}

                              {(apartmentData?.presents.main_items?.length || apartmentData?.presents.second_items?.length) &&
                                 apartmentData.gift_group && (
                                    <section className="relative z-10">
                                       <ApartmentPresents
                                          data={apartmentData.gift_group}
                                          mainGift={apartmentData.presents.main_items}
                                          secondGift={apartmentData.presents.second_items}
                                       />
                                    </section>
                                 )}
                              <QuestionToChat
                                 classNames="white-block"
                                 building_id={apartmentData.building_id}
                                 organization_id={apartmentData.developer.id}
                                 isSpecialist={Boolean(specialistsData.length)}
                              />
                              {apartmentData?.historyPrice && apartmentData?.historyPrice.length > 0 && (
                                 <section className="relative z-10">
                                    <BlockHistoryPrice data={apartmentData.historyPrice} />
                                 </section>
                              )}
                              <FeedBlockPrimary
                                 data={[
                                    ...apartmentData?.videos.filter(item => !item.is_short).map(item => ({ link: item.video_url, type: 'video' })),
                                    ...apartmentData?.videos.filter(item => item.is_short).map(item => ({ link: item.video_url, type: 'short' })),
                                 ]}
                                 currentComplexId={apartmentData?.building_id}
                              />
                              <FeedBlockPrimary
                                 data={[
                                    ...apartmentData?.promos
                                       .filter(item => !item.is_calculation && !item.is_news)
                                       .map(item => ({ ...item, building_id: apartmentData.building_id, type: 'stock' })),
                                    ...apartmentData?.promos
                                       .filter(item => item.is_calculation)
                                       .map(item => ({ ...item, building_id: apartmentData.building_id, type: 'calculation' })),
                                 ]}
                                 currentComplexId={apartmentData?.building_id}
                              />
                              <section>
                                 <BuildingMap coordinates={apartmentData?.location} variant="block" />
                              </section>
                           </div>
                           {isDesktop && <ApartmentSidebar />}
                        </BodyAndSidebar>
                     </ParallaxComponent>
                  </div>
               </div>
               {userRole === ROLE_BUYER.name && (
                  <FixedBlock activeDefault conditionWidth={!isDesktop}>
                     <div
                        className={`pb-2.5 px-4 gap-2 grid grid-cols-2 md3:grid-cols-1  ${
                           Boolean(apartmentSelector.selectedPresents.length + apartmentSelector.defaultPresents.length) ? 'md3:gap-4 pt-4' : 'pt-2.5'
                        }`}>
                        <Button size="Small" onClick={goToChat} className="relative">
                           {Boolean(apartmentSelector.selectedPresents.length + apartmentSelector.defaultPresents.length) && (
                              <BadgeText color="dark" variant="absolute" className="-top-3 -right-3" animated>
                                 Подарки закреплены за вами
                              </BadgeText>
                           )}
                           Задать вопрос в чат
                        </Button>
                        <Button size="Small" variant="secondary" onClick={() => setIsOpenRecordView(true)} className="relative">
                           <AnimatedText texts={['Записаться на просмотр', 'Записаться на онлайн-показ']} intervalTime={3000} />
                        </Button>
                     </div>
                  </FixedBlock>
               )}
            </main>

            {authUser ? (
               <>
                  {Boolean(suggestions.length) ? (
                     <RecordViewingContact
                        condition={isOpenRecordView}
                        set={setIsOpenRecordView}
                        suggestions={suggestions}
                        customUpdate={async () => {
                           setIsOpenRecordView(false);
                           await getSuggestions(id);
                        }}
                     />
                  ) : (
                     <>
                        <ModalWrapper condition={isOpenRecordView}>
                           <RecordViewing
                              condition={isOpenRecordView}
                              set={setIsOpenRecordView}
                              type="apartment"
                              id={apartmentData?.id}
                              developName={apartmentData?.developer.name}
                              objectData={apartmentData}
                              specialists={specialistsData}
                              onUpdate={() => {
                                    getSuggestions(id);
                                 setIsOpenRecordView(false);
                                 setApplicationSentModal(true);
                              }}
                           />
                        </ModalWrapper>
                     </>
                  )}
               </>
            ) : (
               <SelectAccLogModal condition={isOpenRecordView} set={setIsOpenRecordView} />
            )}
            <RecordViewingSent condition={applicationSentModal} set={setApplicationSentModal} />

            <ChoiceSpecialistForChat
               condition={isOpenChoiceSpecialist}
               set={setIsOpenChoiceSpecialist}
               specialists={specialistsData}
               building_id={apartmentData.building_id}
            />
            <ShareModal condition={isOpenShareModal} set={setIsOpenShareModal} />
         </ApartmentContext.Provider>
      </MainLayout>
   );
};

export default Apartment;
