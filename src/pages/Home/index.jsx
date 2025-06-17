import React, { createContext, useEffect } from 'react';

import MainLayout from '../../layouts/MainLayout';
import Header from '../../components/Header';
import HelmetHome from '../../Helmets/HelmetHome';
import { useHomeData } from './useHomeData';
import { ROLE_SELLER } from '../../constants/roles';
import { useNavigate } from 'react-router-dom';
import { BannerSliderMain } from './BannerMain';
import { NavBlock } from './NavBlock';
import Cashback from './Cashback';
import Videos from './Videos';
import Stocks from './Stocks';
import Recommend from './Recommend';
import { SellerRoutesPath } from '../../constants/RoutesPath';
import { useCookies } from 'react-cookie';
import ChatBtnFixed from '../../components/ChatBtnFixed';
import ShowcaseVideos from './ShowcaseVideos';
import SuggestionsHome from './SuggestionsHome';
import { useSelector } from 'react-redux';
import { getIsDesktop } from '../../redux/helpers/selectors';

export const HomeContext = createContext();

const Home = () => {
   const homeData = useHomeData();
   const [cookies] = useCookies();
   const { userRole, authLoading, banners } = homeData;
   const navigate = useNavigate();
   const isDesktop = useSelector(getIsDesktop);

   useEffect(() => {
      if (userRole === ROLE_SELLER.name) {
         navigate(SellerRoutesPath.home);
      }
   }, [userRole]);

   if (cookies.loggedIn && authLoading) {
      return;
   }

   return (
      <MainLayout helmet={<HelmetHome />}>
         <Header />

         <main className="main">
            <h1 className="visually-hidden">На inrut.ru вы можете решить любой вопрос с недвижимостью</h1>
            <div className="main-wrapper">
               <HomeContext.Provider value={{ ...homeData }}>
                  {/* <SuggestionsHome /> */}
                  {/* <BannerSliderMain data={banners.data} /> */}
                  <NavBlock />
                  {isDesktop && <ShowcaseVideos />}
                  <Cashback />
                  {!isDesktop && <Videos />}
                  <Stocks />
                  <Recommend />
               </HomeContext.Provider>
            </div>
         </main>
         <ChatBtnFixed />
      </MainLayout>
   );
};

export default Home;
