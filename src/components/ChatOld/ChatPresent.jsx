import { useContext, useState } from 'react';
import { IconMoney, IconPresent } from '../../ui/Icons';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import Modal from '../../ui/Modal';
import Avatar from '../../ui/Avatar';
import { ChatContext } from '../../context';
import { capitalizeWords } from '../../helpers/changeString';
import Button from '../../uiForm/Button';
import Input from '../../uiForm/Input';
import numberReplace from '../../helpers/numberReplace';
import { useSelector } from 'react-redux';
import { getIsDesktop, getUserInfo } from '../../redux/helpers/selectors';
import Textarea from '../../uiForm/Textarea';
import ChatSmile from './ChatSmile';

const ChatPresent = () => {
   const { currentDialog } = useContext(ChatContext);

   const [isStartModalOpen, setIsStartModalOpen] = useState(false);
   const [isSendModalOpen, setIsSendModalOpen] = useState(null);
   const [isOpenOtherAmount, setIsOpenOtherAmount] = useState(null);
   const [otherAmount, setOtherAmount] = useState('');
   const [textareaValue, setTextareaValue] = useState('');
   const userInfo = useSelector(getUserInfo);
   const isDesktop = useSelector(getIsDesktop);

   return (
      <div className="self-center ml-3">
         <button type="button" className="flex items-center justify-center" title="Отправить подарок" onClick={() => setIsStartModalOpen(true)}>
            <IconPresent className="fill-blue" width={24} height={24} />
         </button>

         <ModalWrapper condition={isStartModalOpen}>
            <Modal
               condition={isStartModalOpen}
               set={setIsStartModalOpen}
               options={{ overlayClassNames: '_center-max-content', modalClassNames: '!w-[470px]', modalContentClassNames: '!px-6' }}>
               <div className="text-defaultMax font-medium text-right mb-4">
                  Баланс <br />0 ₽
               </div>
               <div className="flex flex-col items-center">
                  <Avatar
                     size={90}
                     src={currentDialog.organization ? currentDialog.organization.image : currentDialog.companion.image}
                     title={currentDialog.organization ? currentDialog.organization.name : currentDialog.companion.name}
                  />
                  <h3 className="title-2-5 mt-4">Отправьте подарок</h3>
                  <h3 className="mt-2 text-defaultMax">
                     Выберите подарок для&nbsp;
                     <span className="font-medium">
                        {currentDialog.organization
                           ? currentDialog.organization.name
                           : capitalizeWords(currentDialog.companion.name, currentDialog.companion.surname)}
                     </span>
                  </h3>
               </div>

               {isOpenOtherAmount ? (
                  <Input
                     label="Сумма"
                     size="48"
                     className="mt-4"
                     placeholder="Введите желаемую сумму"
                     after="₽"
                     onChange={value => setOtherAmount(value)}
                     value={otherAmount}
                     onlyNumber
                     convertNumber
                     maxValue="1000000000"
                     maxLength={9}
                  />
               ) : (
                  <div className="mt-8 grid grid-cols-3 gap-4">
                     <button
                        type="button"
                        className="bg-primary700 rounded-[20px] p-5 flex flex-col items-center gap-2"
                        onClick={() => setIsSendModalOpen(10000)}>
                        <IconMoney width={55} height={55} className="stroke-dark" />
                        <p className="text-defaultMax">10 000 ₽</p>
                     </button>
                     <button
                        type="button"
                        className="bg-primary700 rounded-[20px] p-5 flex flex-col items-center gap-2"
                        onClick={() => setIsSendModalOpen(20000)}>
                        <IconMoney width={55} height={55} className="stroke-dark" />
                        <p className="text-defaultMax">20 000 ₽</p>
                     </button>
                     <button
                        type="button"
                        className="bg-primary700 rounded-[20px] p-5 flex flex-col items-center gap-2"
                        onClick={() => setIsSendModalOpen(50000)}>
                        <IconMoney width={55} height={55} className="stroke-dark" />
                        <p className="text-defaultMax">50 000 ₽</p>
                     </button>
                  </div>
               )}
               <div className="mt-4 flex justify-between gap-4 items-center">
                  <button className="blue-link text-defaultMax" onClick={() => setIsOpenOtherAmount(prev => !prev)}>
                     {isOpenOtherAmount ? 'Скрыть' : 'Своя сумма'}
                  </button>
                  {isOpenOtherAmount && (
                     <button
                        type="button"
                        className="blue-link"
                        onClick={() => {
                           if (!otherAmount.length) {
                              console.log('ошибка');
                           } else {
                              setIsSendModalOpen(otherAmount);
                           }
                        }}>
                        Отправить
                     </button>
                  )}
               </div>
            </Modal>
         </ModalWrapper>
         <ModalWrapper condition={Boolean(isSendModalOpen)}>
            <Modal
               condition={Boolean(isSendModalOpen)}
               set={setIsSendModalOpen}
               options={{ overlayClassNames: '_center-max-content', modalClassNames: '!w-[470px]',modalContentClassNames: '!px-6' }}>
               <div className="flex flex-col items-center">
                  <h3 className="text-defaultMax text-center">
                     Вам отправил(а)&nbsp;
                     <span className="font-medium">{userInfo.name}</span>
                     <br />подарок на сумму <span className="font-medium">{numberReplace(isSendModalOpen || '')} ₽</span>
                  </h3>
                  <div className="bg-primary700 rounded-[20px] py-5 px-8 flex justify-center flex-col items-center gap-2 mt-4">
                     <IconMoney width={55} height={55} className="stroke-dark" />
                     <div className="text-defaultMax">
                        <p>Подарок от {userInfo.name}</p>
                     </div>
                  </div>
               </div>
               <Textarea
                  className="mt-4"
                  classNameTextarea="!pr-10"
                  maxLength={200}
                  value={textareaValue}
                  onChange={value => setTextareaValue(value)}
                  placeholder="Ваше сообщение"
                  minHeight={80}
                  smile={isDesktop}
               />
               <Button className="w-full mt-6">Отправить подарок &nbsp;{numberReplace(isSendModalOpen || '')} ₽</Button>
            </Modal>
         </ModalWrapper>
      </div>
   );
};

export default ChatPresent;
