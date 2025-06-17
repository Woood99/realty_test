import { useState } from 'react';
import Modal from '../../../../ui/Modal';
import DragDropImageSolo from '../../../DragDrop/DragDropImageSolo';
import AVATAR from '../../../../assets/img/avatar.png';
import getImagesObj from '../../../../unifComponents/getImagesObj';
import { useSelector } from 'react-redux';
import { getIsDesktop } from '../../../../redux/helpers/selectors';
import { useForm } from 'react-hook-form';
import { ControllerFieldInput } from '../../../../uiForm/ControllerFields/ControllerFieldInput';
import Button from '../../../../uiForm/Button';
import { IconArrow } from '../../../../ui/Icons';
import { ControllerFieldCheckbox } from '../../../../uiForm/ControllerFields/ControllerFieldCheckbox';
import { refactPhotoStageAppend, refactPhotoStageOne, refactPhotoStageTwo } from '../../../../helpers/photosRefact';
import { BASE_URL } from '../../../../constants/api';
import ModalWrapper from '../../../../ui/Modal/ModalWrapper';
import ChatModalSearchDialogs from '../ChatModalSearchDialogs';
import { ROLE_ADMIN } from '../../../../constants/roles';

const ChannelGroupFormModal = ({ condition, set, type }) => {
   const {
      handleSubmit,
      control,
      setValue,
      reset,
      formState: { errors },
   } = useForm({
      defaultValues: {
         title: '',
      },
   });
   const [photo, setPhoto] = useState(null);

   const isDesktop = useSelector(getIsDesktop);
   const [addParticipants, setAddParticipants] = useState(false);
   const [submitIsLoading, setSubmitIsLoading] = useState(false);

   const options = {
      title: type === 'group' ? 'Новая группа' : 'Новый канал',
      inputPlaceholder: type === 'group' ? 'Название группы' : 'Название канала',
      label: type === 'group' ? 'группы' : 'канала',
   };

   const onSubmitHandler = async data => {
      setSubmitIsLoading(true);
      const resData = {
         ...data,
         photo: photo ? [photo] : null,
      };

      const formData = new FormData();

      if (resData.photo) {
         resData.photo = refactPhotoStageOne(resData.photo);
         refactPhotoStageAppend(resData.photo, formData);
         resData.photo = refactPhotoStageTwo(resData.photo);
         resData.photo = resData.photo[0];

         if (!resData.photo.new_image) {
            resData.photo.image = resData.photo.image.replace(BASE_URL, '');
         }
      } else {
         resData.photo = null;
      }

      formData.append('data', JSON.stringify(resData));
      console.log(resData);

      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitIsLoading(false);
      reset();
      set(false);

      const NEW_DIALOG_ID = 10000;
      setAddParticipants(NEW_DIALOG_ID);
   };

   return (
      <>
         <ModalWrapper condition={condition}>
            <Modal
               condition={condition}
               set={set}
               options={{ overlayClassNames: '_left', modalClassNames: 'mmd1:!w-[500px]', modalContentClassNames: 'flex flex-col' }}>
               <h2 className="title-2 mb-8">{options.title}</h2>
               <form className="flex flex-col items-center flex-grow" onSubmit={handleSubmit(onSubmitHandler)}>
                  <DragDropImageSolo
                     defaultLayout={() => <img className="w-full h-full" src={AVATAR} />}
                     image={photo?.image}
                     onChange={file => {
                        setPhoto(file ? getImagesObj(file)[0] : null);
                     }}
                     size={175}
                     className="!rounded-full"
                     changeAvatarChildren={!isDesktop && <div className="blue-link mt-3">Изменить аватарку</div>}
                  />
                  <div className="w-full mt-8 flex flex-col gap-5">
                     <ControllerFieldInput control={control} name="title" beforeText={options.inputPlaceholder} requiredValue errors={errors} />
                     {type === 'channel' && (
                        <ControllerFieldCheckbox
                           variant="toggle"
                           control={control}
                           option={{ value: 'allow_comments', label: 'Разрешить комментарии' }}
                           name="allow_comments"
                        />
                     )}
                  </div>
                  <Button isLoading={submitIsLoading} className="w-full mt-auto">
                     Сохранить
                  </Button>
               </form>
            </Modal>
         </ModalWrapper>

         <ModalWrapper condition={addParticipants}>
            <ChatModalSearchDialogs
               condition={addParticipants}
               set={setAddParticipants}
               selectedType="multiple"
               options={{ title: 'Добавить участников' }}
               customFiltered={item => item.companion.role !== ROLE_ADMIN.id}
               onChange={(dialog_id, selectedDialogsId) => {
                  console.log(dialog_id, selectedDialogsId);
               }}
            />
         </ModalWrapper>
      </>
   );
};

export default ChannelGroupFormModal;
