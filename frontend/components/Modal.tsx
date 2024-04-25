import React, { FC, useState } from 'react';

interface ModalProps {
    onClose: () => void;
    headline: string;
    children: React.ReactNode;
}

export const Modal: FC<ModalProps> = ({ onClose, headline, children }) => {
    return (
        <dialog open className='modal'>
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

