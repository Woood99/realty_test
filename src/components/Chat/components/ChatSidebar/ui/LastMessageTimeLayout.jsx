import dayjs from 'dayjs';
import { isToday } from '../../../../../helpers/changeDate';
import isEmptyArrObj from '../../../../../helpers/isEmptyArrObj';

const LastMessageTimeLayout = ({ data }) => {
   if (!(data.last_message && !isEmptyArrObj(data.last_message))) return;

   return (
      <span className="min-w-max text-dark">
         {isToday(data.last_message.updated_at)
            ? dayjs(data.last_message.updated_at).format('HH:mm')
            : dayjs(data.last_message.updated_at).format('D MMM')}
      </span>
   );
};

export default LastMessageTimeLayout;
