import React, { createContext, useContext } from 'react';
import ConfirmDialog from '../component/dialog/ConfirmDialog';
import InfoDialog from '../component/dialog/InfoDialog';
import { useConfirmDialog } from '../hooks/useConfirmDialog';
import { useInfoDialog } from '../hooks/useInfoDialog';

const DialogContext = createContext<{
  openConfirmDialog: ReturnType<typeof useConfirmDialog>['openConfirmDialog'];
  openInfoDialog: ReturnType<typeof useInfoDialog>['openInfoDialog'];
} | null>(null);

export const useDialog = () => {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error('DialogProvider 未包覆');
  return ctx;
};

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    isOpen,
    title,
    content,
    confirmText,
    cancelText,
    openConfirmDialog,
    handleClose,
    handleConfirm,
  } = useConfirmDialog();

  const {
    isOpen: infoOpen,
    title: infoTitle,
    content: infoContent,
    confirmText: infoConfirmText,
    openInfoDialog,
    closeInfoDialog,
  } = useInfoDialog();

  return (
    <DialogContext.Provider value={{ openConfirmDialog, openInfoDialog }}>
      {children}

      <ConfirmDialog
        isOpen={isOpen}
        title={title}
        content={content}
        confirmText={confirmText}
        cancelText={cancelText}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />

      <InfoDialog
        isOpen={infoOpen}
        title={infoTitle}
        content={infoContent}
        confirmText={infoConfirmText}
        onClose={closeInfoDialog}
      />
    </DialogContext.Provider>
  );
};
