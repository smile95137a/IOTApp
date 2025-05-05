import { useState } from 'react';

export const useMultiDateSpecialDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState<string>('確認');
  const [cancelText, setCancelText] = useState<string>('取消');
  const [resolver, setResolver] = useState<((value: any) => void) | null>(null);

  const openMultiDateSpecialDialog = ({
    confirmText = '確認',
    cancelText = '取消',
  }: {
    confirmText?: string;
    cancelText?: string;
  }): Promise<any> => {
    setConfirmText(confirmText);
    setCancelText(cancelText);
    setIsOpen(true);

    return new Promise((resolve) => {
      setResolver(() => resolve);
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    if (resolver) resolver(false);
  };

  const handleConfirm = (data: any) => {
    setIsOpen(false);
    if (resolver) resolver(data);
  };

  return {
    isOpen,
    confirmText,
    cancelText,
    openMultiDateSpecialDialog,
    handleClose,
    handleConfirm,
  };
};
