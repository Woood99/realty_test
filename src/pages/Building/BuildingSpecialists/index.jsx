import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Specialist from '../../../ui/Specialist';
import { checkAuthUser } from '../../../redux/helpers/selectors';
import { setSelectAccLogModalOpen } from '../../../redux/slices/helpSlice';
import { getDialogId, getUrlNavigateToChatDialog } from '../../../api/getDialogId';
import { CHAT_TYPES } from '../../../components/Chat/constants';

const BuildingSpecialists = ({
   specialists,
   title = 'Менеджеры застройщика',
   descr = 'Напишите застройщику в чат, он подробно ответит на ваши вопросы',
   building_id = null,
   block = true,
}) => {
   if (specialists.length === 0) return;
   const authUser = useSelector(checkAuthUser);
   const dispatch = useDispatch();

   return (
      <div className={`${block ? 'white-block' : ''}`}>
         <h2 className="title-2 mb-5">{title}</h2>
         {descr && <p className="bg-primary700 px-4 py-3 rounded-lg mmd1:w-max">{descr}</p>}
         <div className="mt-4 grid grid-cols-3 gap-4 md2:grid-cols-2">
            {specialists.map((item, index) => {
               return (
                  <Specialist
                     key={index}
                     {...item}
                     link
                     visibleChat
                     onClickChat={async () => {
                        if (authUser) {
                           const id = await getDialogId({
                              building_id: building_id,
                              recipients_id: [item.id],
                              type: CHAT_TYPES.CHAT,
                           });
                           getUrlNavigateToChatDialog(id);
                        } else {
                           dispatch(setSelectAccLogModalOpen(true));
                        }
                     }}
                  />
               );
            })}
         </div>
      </div>
   );
};

export default BuildingSpecialists;
