import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import { SuggestionsCardActionsContext, SuggestionsContext } from '../../../context';
import { IconChat } from '../../../ui/Icons';
import { checkAuthUser } from '../../../redux/helpers/selectors';
import { getDialogId, getUrlNavigateToChatDialog } from '../../../api/getDialogId';
import { setSelectAccLogModalOpen } from '../../../redux/slices/helpSlice';
import Button from '../../../uiForm/Button';
import { suggestionsTypes } from '../suggestions-types';
import { ROLE_BUYER, ROLE_SELLER } from '../../../constants/roles';
import { CHAT_TYPES } from '../../Chat/constants';

const SuggestionsCardActionChat = ({ className }) => {
   const { suggestions_type } = useContext(SuggestionsContext);

   const { user, is_active, specialist, organization, type, id, building_id } = useContext(SuggestionsCardActionsContext);
   const authUser = useSelector(checkAuthUser);
   const dispatch = useDispatch();

   const goToChat = async () => {
      if (!is_active) return;
      if (authUser) {
         const isBuyerSuggestionType = suggestions_type.id === suggestionsTypes.buyerOnly.id || suggestions_type.id === suggestionsTypes.buyerAll.id;
         const isSellerSuggestionType = suggestions_type.id === suggestionsTypes.sellerAll.id;
         const currentUserInfo = isBuyerSuggestionType ? specialist || organization : isSellerSuggestionType ? user : null;
         const building_id_by_type = type === 'apartment' ? +building_id : +id;

         if (currentUserInfo.pos === 'Застройщик') {
            const dialogId = await getDialogId({
               building_id: building_id_by_type,
               organization_id: +currentUserInfo.id,
               type: CHAT_TYPES.CHAT,
            });
            getUrlNavigateToChatDialog(dialogId);
         }
         if (currentUserInfo.role === ROLE_SELLER.id || currentUserInfo.role === ROLE_BUYER.id) {
            const dialogId = await getDialogId({
               building_id: building_id_by_type,
               recipients_id: [+currentUserInfo.id],
               type: CHAT_TYPES.CHAT,
            });
            getUrlNavigateToChatDialog(dialogId);
         }
      } else {
         dispatch(setSelectAccLogModalOpen(true));
      }
   };

   return (
      <Button className={cn('!px-4 !gap-2 text-dark', className)} variant="secondary" size="34" title="Перейти в чат" onClick={goToChat}>
         <IconChat className="fill-primary400" width={16} height={16} />
         Перейти в чат
      </Button>
   );
};

export default SuggestionsCardActionChat;
