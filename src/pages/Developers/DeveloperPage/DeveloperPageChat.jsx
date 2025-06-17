import { useDispatch, useSelector } from 'react-redux';
import { useContext } from 'react';

import { checkAuthUser } from '../../../redux/helpers/selectors';
import { getDialogId, getUrlNavigateToChatDialog } from '../../../api/getDialogId';
import { setSelectAccLogModalOpen } from '../../../redux/slices/helpSlice';
import Button from '../../../uiForm/Button';
import { DeveloperPageContext } from '../../../context';
import { CHAT_TYPES } from '../../../components/Chat/constants';

const DeveloperPageChat = ({ className, size = '34' }) => {
   const { data } = useContext(DeveloperPageContext);

   const authUser = useSelector(checkAuthUser);
   const dispatch = useDispatch();

   const goToChat = async () => {
      if (authUser) {
         const id = await getDialogId({ organization_id: data.id, type: CHAT_TYPES.CHAT });
         getUrlNavigateToChatDialog(id);
      } else {
         dispatch(setSelectAccLogModalOpen(true));
      }
   };

   return (
      <Button size={size} className={className} onClick={goToChat}>
         Написать сообщение
      </Button>
   );
};

export default DeveloperPageChat;
