import { useState } from 'react';

export const useConfirmDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState<string>('系統提示');
  const [content, setContent] = useState<string>('');
  const [confirmText, setConfirmText] = useState<string>('確認');
  const [cancelText, setCancelText] = useState<string>('取消');
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(
    null
  );

  const openConfirmDialog = ({
    title = '系統提示',
    content,
    confirmText = '確認',
    cancelText = '取消',
  }: {
    title?: string;
    content: string;
    confirmText?: string;
    cancelText?: string;
  }): Promise<boolean> => {
    setTitle(title);
    setContent(content);
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

  const handleConfirm = () => {
    setIsOpen(false);
    if (resolver) resolver(true);
  };

  return {
    isOpen,
    title,
    content,
    confirmText,
    cancelText,
    openConfirmDialog,
    handleClose,
    handleConfirm,
  };
};
