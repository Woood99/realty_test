import React from 'react';
import Modal from '../../ui/Modal';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import BuildingSpecialists from '../../pages/Building/BuildingSpecialists';

const ChoiceSpecialistForChat = ({ condition, set, specialists = [], building_id }) => {
   if (specialists.length > 0) {
      return (
         <ModalWrapper condition={condition}>
            <Modal condition={Boolean(condition)} set={set} options={{ overlayClassNames: '_center-max-content', modalClassNames: '!w-[800px]' }}>
               <BuildingSpecialists
                  specialists={specialists}
                  building_id={building_id}
                  title="Выберите менеджера для консультации"
                  // descr="По умолчанию ваша камера будет выключена"
                  block={false}
               />
            </Modal>
         </ModalWrapper>
      );
   }
};

export default ChoiceSpecialistForChat;
