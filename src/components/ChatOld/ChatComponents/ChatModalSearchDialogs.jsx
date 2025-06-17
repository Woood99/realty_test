import { useContext, useEffect, useState } from 'react';
import Modal from '../../../ui/Modal';
import { ChatContext } from '../../../context';
import Input from '../../../uiForm/Input';
import { useSelector } from 'react-redux';
import { getUserInfo } from '../../../redux/helpers/selectors';
import { getShortNameSurname } from '../../../helpers/changeString';
import { ROLE_ADMIN } from '../../../constants/roles';
import UserInfo from '../../../ui/UserInfo';
import { IconChecked } from '../../../ui/Icons';

const ChatModalSearchDialogs = ({ condition, set, options = {}, selectedType = 'multiple', onChange = () => {}, customFiltered = item => item }) => {
   const { dialogs } = useContext(ChatContext);
   const { title = 'Добавить' } = options;

   const [newDialogs, setNewDialogs] = useState(dialogs);
   const [selectedDialogs, setSelectedDialogs] = useState([]);
   const [search, setSearch] = useState('');
   const userInfo = useSelector(getUserInfo);

   useEffect(() => {
      const searchLowerCase = search.toLowerCase();

      const filtered = dialogs.filter(customFiltered).filter(item => {
         const name =
            item.organization && userInfo?.role?.id !== ROLE_ADMIN.id ? item.organization.name : `${item.companion.name} ${item.companion.surname}`;
         return name.toLowerCase().includes(searchLowerCase);
      });
      setNewDialogs(filtered);
   }, [search]);

   return (
      <Modal
         condition={condition}
         set={set}
         options={{
            overlayClassNames: '_center-max-content',
            modalClassNames: '!w-[400px] !h-[700px] flex-col',
            modalContentClassNames: '!py-8 !pb-4 !px-0',
         }}
         ModalFooter={() => (
            <div className="ModalFooter !gap-4">
               <button type="button" onClick={() => set(null)} className="blue-link">
                  {selectedType === 'single' ? 'Отменить' : 'Пропустить'}
               </button>
               {selectedType === 'multiple' && (
                  <button
                     type="button"
                     onClick={() => {
                        onChange(condition, selectedDialogs);
                        set(null);
                     }}
                     className="blue-link">
                     Добавить
                  </button>
               )}
            </div>
         )}>
         <div className="px-8">
            <h2 className="title-2-5 mb-4">{title}</h2>
            <Input placeholder="Поиск" search value={search} onChange={value => setSearch(value)} />
         </div>
         <div className="mt-4">
            {newDialogs.length > 0 ? (
               <div className="flex flex-col">
                  {newDialogs.map(item => {
                     return (
                        <button
                           key={item.id}
                           type="button"
                           className="flex justify-between items-center gap-4 hover:bg-hoverPrimary"
                           onClick={() => {
                              if (selectedType === 'single') {
                                 onChange(condition, item.id);
                                 set(null);
                              }
                              if (selectedType === 'multiple') {
                                 if (selectedDialogs.includes(item.id)) {
                                    setSelectedDialogs(prev => prev.filter(id => id !== item.id));
                                 } else {
                                    setSelectedDialogs(prev => [...prev, item.id]);
                                 }
                              }
                           }}>
                           <UserInfo
                              sizeAvatar={45}
                              avatar={item.organization && userInfo?.role?.id !== ROLE_ADMIN.id ? item.organization.image : item.companion.image}
                              name={
                                 item.organization && userInfo?.role?.id !== ROLE_ADMIN.id
                                    ? item.organization.name
                                    : getShortNameSurname(item.companion.name, item.companion.surname)
                              }
                              className="text-left w-full py-3 px-8 items-center"
                              posChildren={
                                 <div className="flex flex-col mt-1 text-primary400 w-full">
                                    {item.building && (
                                       <div className="mb-2 flex">
                                          <span className="cut-one">ЖК {item.building.name}</span>
                                       </div>
                                    )}
                                 </div>
                              }
                              centered
                           />
                           {selectedDialogs.includes(item.id) && (
                              <div className="bg-blue w-5 h-5 rounded-full flex-center-all flex-shrink-0 mr-8" aria-hidden>
                                 <IconChecked className="fill-none stroke-white" width={10} height={10} />
                              </div>
                           )}
                        </button>
                     );
                  })}
               </div>
            ) : (
               <p className="text-primary400 text-center">Чаты не найдены</p>
            )}
         </div>
      </Modal>
   );
};

export default ChatModalSearchDialogs;
