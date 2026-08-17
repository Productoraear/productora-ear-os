import { useState, useCallback } from 'react';

export type ModalType = 
    | 'settings' 
    | 'history' 
    | 'save' 
    | 'preview' 
    | 'ai' 
    | 'knowledge' 
    | 'projects' 
    | 'wisdom' 
    | 'about' 
    | 'command' 
    | 'scratchpad';

export const useModalManager = () => {
    const [activeModal, setActiveModal] = useState<ModalType | null>(null);

    const openModal = useCallback((modal: ModalType) => setActiveModal(modal), []);
    const closeModal = useCallback(() => setActiveModal(null), []);
    const toggleModal = useCallback((modal: ModalType) => {
        setActiveModal(current => current === modal ? null : modal);
    }, []);

    const isOpen = useCallback((modal: ModalType) => activeModal === modal, [activeModal]);

    return {
        activeModal,
        openModal,
        closeModal,
        toggleModal,
        isOpen
    };
};