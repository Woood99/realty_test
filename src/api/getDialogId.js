import { AuthRoutesPath } from '../constants/RoutesPath';
import { sendPostRequest } from './requestsApi';

export const getDialogId = async (data, setError) => {
   try {
      return sendPostRequest('/api/dialogs/get-dialog-id', data).then(res => res.data.result);
   } catch (error) {
      if (setError) {
         setError(true);
      }
      throw new Error('error');
   }
};

export const getUrlNavigateToChat = () => {
   window.open(AuthRoutesPath.chat, '_blank');
};
export const getUrlNavigateToChatDialog = (id, tag) => {
   window.open(`${AuthRoutesPath.chat}?dialog=${id}${tag ? '&tag=' + tag : ''}`, '_blank');
};
