import { useContext } from 'react';
import Modal from '../../../ui/Modal';
import ModalWrapper from '../../../ui/Modal/ModalWrapper';
import { ChatContext } from '../../../context';
import ModalHeader from '../../../ui/Modal/ModalHeader';
import { useForm } from 'react-hook-form';
import { ControllerFieldInput } from '../../../uiForm/ControllerFields/ControllerFieldInput';
import { timesOptions } from '../../../data/selectsField';
import { ControllerFieldTextarea } from '../../../uiForm/ControllerFields/ControllerFieldTextarea';
import { ControllerFieldCheckbox } from '../../../uiForm/ControllerFields/ControllerFieldCheckbox';
import Button from '../../../uiForm/Button';

const ChatCreateEventModal = () => {
   const { currentDialog, createEventModal, setCreateEventModal } = useContext(ChatContext);

   const {
      handleSubmit,
      control,
      setValue,
      reset,
      formState: { errors },
   } = useForm({
      defaultValues: {
         title: '',
         description: '',
         date: '',
         time: '',
         location: '',
         link: false,
      },
   });

   const onSubmitHandler = async data => {};

   return (
      <ModalWrapper condition={createEventModal}>
         <Modal
            condition={createEventModal}
            set={setCreateEventModal}
            closeBtn={false}
            ModalHeader={() => (
               <ModalHeader set={setCreateEventModal} className="px-8 py-6">
                  <h2 className="title-2-5">Создать мероприятие</h2>
               </ModalHeader>
            )}
            options={{
               overlayClassNames: '_center-max-content-desktop',
               modalClassNames: 'mmd1:!w-[600px] mmd1:!h-[800px] flex-col',
               modalContentClassNames: '!pt-5 !pb-8 !px-8',
            }}>
            <form onSubmit={handleSubmit(onSubmitHandler)} className="flex flex-col gap-3 min-h-full">
               <ControllerFieldInput control={control} beforeText="Название мероприятия" name="title" requiredValue errors={errors} />
               <ControllerFieldTextarea
                  control={control}
                  maxLength={1500}
                  minHeight={80}
                  name="description"
                  placeholder="Описание"
                  requiredValue
                  errors={errors}
               />
               <div className="grid grid-cols-2 gap-3">
                  <ControllerFieldInput
                     control={control}
                     datePicker
                     minDate={new Date()}
                     maxDate={new Date(new Date().getTime() + 12 * 24 * 60 * 60 * 1000)}
                     beforeText="Дата"
                     name="date"
                     requiredValue
                     errors={errors}
                  />

                  <ControllerFieldInput
                     control={control}
                     mask="hhmmMask"
                     selectionButtons={{
                        options: timesOptions.map(item => item.value),
                        className: 'grid grid-cols-4 gap-2',
                        required: true,
                     }}
                     beforeText="Время"
                     name="time"
                     requiredValue
                     errors={errors}
                  />
               </div>
               <ControllerFieldInput control={control} beforeText="Местоположение" name="location" requiredValue errors={errors} />
               <div className="mt-3">
                  <ControllerFieldCheckbox variant="toggle" control={control} option={{ value: 'link', label: 'Ссылка на звонок' }} name="link" />
               </div>
               <div className="mt-auto">
                  <Button className="mt-6 w-full">Создать</Button>
               </div>
            </form>
         </Modal>
      </ModalWrapper>
   );
};

export default ChatCreateEventModal;
