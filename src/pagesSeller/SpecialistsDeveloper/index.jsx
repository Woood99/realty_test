import { useEffect, useState } from 'react';
import SellerLayout from '../../layouts/SellerLayout';
import Specialist from '../../ui/Specialist';
import { useSelector } from 'react-redux';
import { getUserInfo } from '../../redux/helpers/selectors';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import { getSpecialistsOrganization } from '../../api/Building/getSpecialists';
import { getDialogId, getUrlNavigateToChatDialog } from '../../api/getDialogId';
import { IconChat } from '../../ui/Icons';
import { CHAT_TYPES } from '../../components/Chat/constants';

const SpecialistsDeveloper = () => {
   const [data, setData] = useState([]);
   const userInfo = useSelector(getUserInfo);

   useEffect(() => {
      if (isEmptyArrObj(userInfo)) return;
      if (!userInfo.organization.id) return;

      const fetch = async () => {
         const specialists = await getSpecialistsOrganization(userInfo.organization.id);
         setData(specialists);
      };

      fetch();
   }, [userInfo]);

   return (
      <SellerLayout pageTitle="Менеджеры отдела продаж">
         <h2 className="title-2 mb-4">Менеджеры отдела продаж</h2>
         <div className="grid grid-cols-5 gap-x-5 gap-y-10 md3:grid-cols-3 md4:grid-cols-2">
            {data.map(item => {
               return (
                  <Specialist
                     key={item.id}
                     {...item}
                     link
                     visibleChat
                     onClickChat={async () => {
                        const id = await getDialogId({
                           recipients_id: [item.id],
                           type: CHAT_TYPES.CHAT,
                        });
                        getUrlNavigateToChatDialog(id);
                     }}
                  />
               );
            })}
         </div>
      </SellerLayout>
   );
};

export default SpecialistsDeveloper;
