import React, { createContext, useContext } from 'react';
import ConfirmDialog from '../component/dialog/ConfirmDialog';
import InfoDialog from '../component/dialog/InfoDialog';
import MultiDateSpecialDialog from '../component/dialog/MultiDateSpecialDialog';

import { useConfirmDialog } from '../hooks/useConfirmDialog';
import { useInfoDialog } from '../hooks/useInfoDialog';
import { useMultiDateSpecialDialog } from '../hooks/useMultiDateSpecialDialog';

const DialogContext = createContext<{
  openConfirmDialog: ReturnType<typeof useConfirmDialog>['openConfirmDialog'];
  openInfoDialog: ReturnType<typeof useInfoDialog>['openInfoDialog'];
  openMultiDateSpecialDialog: ReturnType<
    typeof useMultiDateSpecialDialog
  >['openMultiDateSpecialDialog'];
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

  // multi date special dialog 狀態
  const {
    isOpen: multiDateOpen,
    confirmText: multiDateConfirmText,
    cancelText: multiDateCancelText,
    openMultiDateSpecialDialog,
    handleClose: handleMultiDateClose,
    handleConfirm: handleMultiDateConfirm,
  } = useMultiDateSpecialDialog();

  return (
    <DialogContext.Provider
      value={{ openConfirmDialog, openInfoDialog, openMultiDateSpecialDialog }}
    >
      {children}

      {/* MultiDateSpecialDialog */}
      <MultiDateSpecialDialog
        isOpen={multiDateOpen}
        onClose={handleMultiDateClose}
        onConfirm={handleMultiDateConfirm}
      />

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
