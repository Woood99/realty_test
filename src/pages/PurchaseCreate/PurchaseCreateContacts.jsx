import React, { useContext } from 'react';
import { PurchaseCreateContext } from '../../context';
import { ControllerFieldInput, ControllerFieldInputPhone } from '../../uiForm/ControllerFields/ControllerFieldInput';
import { useSelector } from 'react-redux';
import { getUserInfo } from '../../redux/helpers/selectors';

const PurchaseCreateContacts = () => {
   const { control, errors, isEdit, defaultData } = useContext(PurchaseCreateContext);
    const userInfo = useSelector(getUserInfo);

   return (
      <div data-block="contacts">
         <h2 className="title-2 mb-6">Ваши контакты</h2>
         <div className="grid grid-cols-2 gap-4 md3:grid-cols-1">
            <ControllerFieldInputPhone
               control={control}
               beforeText="Номер телефона"
               name="phone"
               errors={errors}
               defaultValue={userInfo?.phone || (isEdit ? defaultData.user_phone : '') || ''}
               disabled={Boolean(userInfo?.phone)}
            />
            <ControllerFieldInput
               control={control}
               beforeText="Имя, фамилия"
               name="name"
               errors={errors}
               requiredValue
               defaultValue={userInfo?.name || (isEdit ? defaultData.user_name : '') || ''}
               // disabled={Boolean(userInfo?.name)}
            />
         </div>
      </div>
   );
};

export default PurchaseCreateContacts;
