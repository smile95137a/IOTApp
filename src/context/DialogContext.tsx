import React, { createContext, useContext } from 'react';

import { useConfirmDialog } from '../hooks/useConfirmDialog';
import { useInfoDialog } from '../hooks/useInfoDialog';
import ConfirmDialog from '@/components/frontend/dialog/ConfirmDialog';
import InfoDialog from '@/components/frontend/dialog/InfoDialog';

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
  // confirm dialog 狀態
  const {
    isOpen: confirmOpen,
    title: confirmTitle,
    content: confirmContent,
    confirmText: confirmConfirmText,
    cancelText: confirmCancelText,
    openConfirmDialog,
    handleClose: handleConfirmClose,
    handleConfirm: handleConfirmConfirm,
  } = useConfirmDialog();

  // info dialog 狀態
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

      {/* ConfirmDialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title={confirmTitle}
        content={confirmContent}
        confirmText={confirmConfirmText}
        cancelText={confirmCancelText}
        onClose={handleConfirmClose}
        onConfirm={handleConfirmConfirm}
      />

      {/* InfoDialog */}
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
