import React from 'react';

interface InfoDialogProps {
  isOpen: boolean;
  title?: string;
  content: string;
  confirmText?: string;
  onClose: () => void;
}

const InfoDialog: React.FC<InfoDialogProps> = ({
  isOpen,
  title = '提示訊息',
  content,
  confirmText = '確認',
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="info-dialog__overlay">
      <div className="info-dialog">
        <div className="info-dialog__icon"></div>

        <h2 className="info-dialog__title">{title}</h2>
        <p className="info-dialog__content">{content}</p>

        <button className="info-dialog__button" onClick={onClose}>
          {confirmText}
        </button>
      </div>
    </div>
  );
};

export default InfoDialog;
