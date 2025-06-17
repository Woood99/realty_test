import React, { useState } from 'react';
import Modal from '../../ui/Modal';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { RoutesPath } from '../../constants/RoutesPath';
import { sendPostRequest } from '../../api/requestsApi';
import BlockPersonalDiscount from '../../components/BlockPersonalDiscount';

const NotificationsModal = ({ condition, set, data = [] }) => {
   const [reads, setReads] = useState([]);

   console.log(data);

   const notificationRead = id => {
      if (!reads.includes(id)) {
         setReads(prev => [...prev, id]);
         sendPostRequest(`/api/notification/read/${id}`);
      }
   };

   return (
      <Modal options={{ overlayClassNames: '_right', modalClassNames: '!max-w-[650px]' }} set={set} condition={condition}>
         <h2 className="title-2 modal-title-gap">Уведомления</h2>
         {data.length === 0 ? (
            <p className="text-primary400">Новых уведомлений нет</p>
         ) : (
            <div className="flex flex-col">
               {data.map(item => {
                  return (
                     <article
                        onMouseEnter={() => notificationRead(item.id)}
                        key={item.id}
                        className="relative mb-6 pb-6 border-bottom-primary100 [&:last-child]:!mb-0 [&:last-child]:!pb-0 [&:last-child]:!border-none">
                        <Link
                           to={
                              item.notificationable_type === 'App\\Models\\Building'
                                 ? `${RoutesPath.building}${item.info.id}`
                                 : `${RoutesPath.apartment}${item.info.id}`
                           }
                           className="CardLinkElement"
                        />
                        <p className="text-verySmall mb-1 font-medium">{dayjs(item.updated_at).format('DD.MM.YYYY')}</p>
                        {item.discount ? (
                           <BlockPersonalDiscount data={item.discount} mainData={item.info} />
                        ) : (
                           <>
                              <h3 className="title-4 mb-2">{item.title}</h3>
                              <p>{item.description}</p>
                           </>
                        )}
                     </article>
                  );
               })}
            </div>
         )}
      </Modal>
   );
};

export default NotificationsModal;
