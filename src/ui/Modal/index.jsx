import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import './Modal.scss';
import { IconClose } from '../Icons';

function ConditionalPortal({ children, usePortal }) {
   if (usePortal) {
      return createPortal(children, document.getElementById('overlay-wrapper'));
   }

   return children;
}

function Modal({
   children,
   condition,
   set,
   options,
   style,
   closeBtn = true,
   closeBtnWhite = false,
   closeBtnDark = false,
   ModalHeader,
   ModalFooter,
   ModalChildren,
   usePortal = true,
}) {
   useEffect(() => {
      const close = e => {
         if (e.keyCode === 27) {
            if (!document.querySelector('#ymap-fulscreen-active')) {
               set(false);
            }
         }
      };
      window.addEventListener('keydown', close);
      return () => window.removeEventListener('keydown', close);
   }, [set]);

   if (!Boolean(condition)) {
      return '';
   }
   return (
      <ConditionalPortal usePortal={usePortal}>
         <div onClick={() => set(false)} style={style} className={`modal-overlay ${(options && options.overlayClassNames) || ''}`}>
            <div onClick={e => e.stopPropagation()} className={`modal ${(options && options.modalClassNames) || ''}`}>
               {closeBtn && (
                  <button
                     onClick={() => set(false)}
                     className={`modal-close ${closeBtnWhite ? 'modal-close-white' : ''} ${closeBtnDark ? 'modal-close-dark' : ''} ${
                        (options && options.modalCloseClassNames) || ''
                     }`}>
                     <IconClose width={25} height={25} />
                     <div>
                        <span></span>
                     </div>
                  </button>
               )}
               {ModalHeader ? <ModalHeader /> : ''}
               <div className={`modal-content scrollbarPrimary ${(options && options.modalContentClassNames) || ''}`}>{children}</div>
               {ModalFooter ? <ModalFooter /> : ''}
               {ModalChildren ? <ModalChildren /> : ''}
            </div>
         </div>
      </ConditionalPortal>
   );
}

export function ModalDisplay({ children, condition, set, options, style, closeBtn = true, ModalHeader, ModalFooter, ModalChildren }) {
   useEffect(() => {
      const close = e => {
         if (e.keyCode === 27) set(false);
      };
      window.addEventListener('keydown', close);
      return () => window.removeEventListener('keydown', close);
   }, [set]);

   return createPortal(
      <div
         onClick={() => set(false)}
         style={style}
         className={`modal-overlay !z-[99999] ${(options && options.overlayClassNames) || ''} ${!Boolean(condition) ? '!hidden' : ''}`}
         data-modal-display={Boolean(condition)}>
         <div onClick={e => e.stopPropagation()} className={`modal ${(options && options.modalClassNames) || ''}`}>
            {closeBtn && (
               <button onClick={() => set(false)} className="modal-close">
                  <IconClose width={25} height={25} className="fill-blue" />
                  <div>
                     <span></span>
                  </div>
               </button>
            )}
            {ModalHeader ? <ModalHeader /> : ''}
            <div className={`modal-content scrollbarPrimary ${(options && options.modalContentClassNames) || ''}`}>{children}</div>
            {ModalFooter ? <ModalFooter /> : ''}
            {ModalChildren ? <ModalChildren /> : ''}
         </div>
      </div>,
      document.getElementById('overlay-wrapper')
   );
}

export default Modal;
