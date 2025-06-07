import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  content: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title = '本桌已被使用中！',
  content,
  onClose,
  onConfirm,
  confirmText = '預約開台',
  cancelText = '結束',
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-dialog__overlay">
      <div className="confirm-dialog">
        <div className="confirm-dialog__icon"></div>

        <h2 className="confirm-dialog__title">{title}</h2>
        <p className="confirm-dialog__content">{content}</p>

        <div className="confirm-dialog__buttons">
          <button
            className="confirm-dialog__button confirm-dialog__button--confirm"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
          <button
            className="confirm-dialog__button confirm-dialog__button--cancel"
            onClick={onClose}
          >
            <span>{cancelText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
