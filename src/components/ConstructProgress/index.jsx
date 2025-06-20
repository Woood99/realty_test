import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import ProgressCard from '../../ui/ProgressCard';
import { NavBtnNext, NavBtnPrev } from '../../ui/NavBtns';
import { nearestYearsOptions, quartersOptions } from '../../data/selectsField';
import { sendPostRequest } from '../../api/requestsApi';
import Modal from '../../ui/Modal';
import CreateConstructProgress from '../../admin/pages/Object/CreateConstructProgress';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import { getVideos } from '../../api/other/getVideos';
import { GalleryRowTabs } from '../GalleryRow';
import { useSelector } from 'react-redux';
import { getIsDesktop, getWindowSize } from '../../redux/helpers/selectors';
import Select from '../../uiForm/Select';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import EmptyBlock from '../EmptyBlock';

const ConstructProgress = ({ data, isAdmin = false, desktopLength = 3, sidebar, sending = () => {}, options }) => {
   const [editModalOpen, setEditModalOpen] = useState(false);

   const isDesktop = useSelector(getIsDesktop);
   const { viewportHeight } = useSelector(getWindowSize);

   const [isModalActive, setIsModalActive] = useState(false);

   const [formValues, setFormValues] = useState({
      frame: {},
      year: {},
      quarter: {},
   });

   const deleteCard = async historyId => {
      const currentData = data.find(item => item.id === historyId);
      if (currentData.ytVideo) {
         const videoData = await getVideos([currentData.ytVideo]);
         if (videoData[0]) {
            await sendPostRequest(`/admin-api/building/${options.dataObject.id}/unlink-video/${videoData[0].id}`);
         }
      }
      await sendPostRequest(`/admin-api/building/${options.dataObject.id}/history/${historyId}/delete`).then(res => {
         sending();
      });
   };
   
   const [currentData, setCurrentData] = useState(data);
   
   useEffect(() => {
      setCurrentData(data);
      setFormValues({
         frame: {},
         year: {},
         quarter: {},
      });
   },[data])

   useEffect(() => {
      const fetch = async () => {
         const result = [];
         let videos = data
            .map(item => ({
               url: item.ytVideo,
               id: item.id,
            }))
            .filter(item => item.url);

         await getVideos(videos.map(item => item.url)).then(res => {
            res.forEach(item => {
               const current = data.find(i => i.ytVideo === item.video_url);
               result.push({
                  ...current,
                  video: item,
               });
            });
         });

         return result;
      };

      fetch().then(res => {
         setCurrentData(prev => {
            return prev.map(item => {
               if (item.ytVideo) {
                  return res.find(i => i.video.video_url === item.ytVideo);
               } else {
                  return item;
               }
            });
         });
      });
   }, [currentData?.length]);

   useEffect(() => {
      setCurrentData(prev => {
         return prev.map(item => {
            item.isHidden =
               Boolean(!isEmptyArrObj(formValues.frame) && item.liter !== formValues.frame.value) ||
               Boolean(!isEmptyArrObj(formValues.quarter) && item.quarter !== formValues.quarter.value) ||
               Boolean(!isEmptyArrObj(formValues.year) && item.year !== formValues.year.value);
            return item;
         });
      });
   }, [JSON.stringify(formValues)]);

   return (
      <>
         {data.length > 0 && (
            <div>
               <div className="grid grid-cols-[repeat(3,minmax(240px,1fr))] gap-2 mb-6">
                  {/* <Select
                     options={options.frames}
                     nameLabel="Корпус"
                     onChange={selectedOption => setFormValues(prev => ({ ...prev, frame: selectedOption }))}
                     value={formValues.frame}
                     defaultOption
                  />
                  <Select
                     options={nearestYearsOptions}
                     nameLabel="Год"
                     onChange={selectedOption => setFormValues(prev => ({ ...prev, year: selectedOption }))}
                     value={formValues.year}
                     defaultOption
                  /> */}
                  <Select
                     options={quartersOptions}
                     nameLabel="Квартал"
                     onChange={selectedOption => setFormValues(prev => ({ ...prev, quarter: selectedOption }))}
                     value={formValues.quarter}
                     defaultOption
                  />
               </div>
               {currentData.filter(item => !item.isHidden).length ? (
                  <Swiper
                     modules={[Navigation]}
                     slidesPerView={1}
                     navigation={{
                        prevEl: '.slider-btn-prev',
                        nextEl: '.slider-btn-next',
                     }}
                     spaceBetween={16}
                     breakpoints={{
                        799: {
                           slidesPerView: 2.5,
                           spaceBetween: 24,
                        },
                        1222: {
                           slidesPerView: desktopLength,
                           spaceBetween: 24,
                        },
                     }}>
                     {currentData
                        .filter(item => !item.isHidden)
                        .map((item, index) => {
                           return (
                              <SwiperSlide key={index}>
                                 <ProgressCard
                                    data={item}
                                    isAdmin={isAdmin}
                                    deleteCard={deleteCard}
                                    editCard={() => setEditModalOpen(item)}
                                    onClick={() => setIsModalActive(item)}
                                 />
                              </SwiperSlide>
                           );
                        })}
                     <NavBtnPrev centery="true" className="slider-btn-prev" disabled />
                     <NavBtnNext centery="true" className="slider-btn-next" />
                  </Swiper>
               ) : (
                  <EmptyBlock block={false} />
               )}
            </div>
         )}

         <ModalWrapper condition={isModalActive}>
            <Modal
               condition={isModalActive !== false}
               set={setIsModalActive}
               options={{ overlayClassNames: '_full', modalContentClassNames: 'md1:!px-0' }}>
               <GalleryRowTabs
                  sidebar={sidebar}
                  data={
                     isModalActive && isModalActive.images.length
                        ? [
                             isModalActive.images.length ? { title: 'Фото', id: 0, type: 'images', images: isModalActive.images } : null,
                             isModalActive.video ? { title: 'Видео', id: 1, type: 'videos', videos: [isModalActive.video] } : null,
                          ].filter(item => item)
                        : []
                  }
                  videosData={isModalActive && isModalActive.video ? [isModalActive.video] : []}
                  mode="modal"
                  setIsOpenModal={setIsModalActive}
                  galleryHeight={isDesktop ? (viewportHeight >= 900 ? 900 : viewportHeight) - 117 - 32 : 550}
               />
            </Modal>
         </ModalWrapper>

         <ModalWrapper condition={editModalOpen}>
            <CreateConstructProgress
               conditionModal={editModalOpen !== false}
               setModal={setEditModalOpen}
               options={{
                  frames: options.frames,
                  dataObject: options.dataObject,
                  specialists: options.specialists,
                  authorDefault: options.authorDefault,
                  tags: options.tags,
                  onUpdate: async data => {
                     await options.onUpdate(data || {});
                  },
               }}
               type="edit"
               values={editModalOpen}
               sending={sending}
            />
         </ModalWrapper>
      </>
   );
};

export default ConstructProgress;
