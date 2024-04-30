import React, { FC, useEffect, useState } from 'react';

interface ModalProps {
    onClose: () => void;
    headline: string;
    id: string;
    children: React.ReactNode;
}

export const Modal: FC<ModalProps> = ({ onClose, headline, id, children }) => {

    const handleKeyDown = (event: { key: string; }) => {
        if (event.key === 'Escape') {
            onClose();
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <dialog open className='modal' id={id}>
            <article>
                <div className='modal-header'>
                    <h2>{headline}</h2>
                    <button className='small outline secondary' onClick={onClose}>Close</button>
                </div>
                <div className='modal-body'>
                    {children}
                </div>
            </article>
        </dialog>
    );
};

