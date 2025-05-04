import { useState } from 'react';

export const useInfoDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('提示訊息');
  const [content, setContent] = useState('');
  const [confirmText, setConfirmText] = useState('確認');

  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(
    null
  );

  const openInfoDialog = ({
    title = '提示訊息',
    content,
    confirmText = '確認',
  }: {
    title?: string;
    content: string;
    confirmText?: string;
  }) => {
    setTitle(title);
    setContent(content);
    setConfirmText(confirmText);
    setIsOpen(true);

    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  };

  const closeInfoDialog = () => {
    setIsOpen(false);
    if (resolver) {
      resolver(true);
      setResolver(null);
    }
  };

  return {
    isOpen,
    title,
    content,
    confirmText,
    openInfoDialog,
    closeInfoDialog,
  };
};
