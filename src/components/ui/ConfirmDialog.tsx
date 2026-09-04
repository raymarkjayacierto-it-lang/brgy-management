import React from 'react';
import { AlertTriangle, Info, Trash2 } from 'lucide-react';
import { Button } from './Button';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false
}) => {
  if (!isOpen) return null;

  const iconMap = {
    danger: <Trash2 className="w-6 h-6 text-red-600" />,
    warning: <AlertTriangle className="w-6 h-6 text-amber-600" />,
    primary: <Info className="w-6 h-6 text-gov-primary" />
  };

  const bgMap = {
    danger: 'bg-red-100',
    warning: 'bg-amber-100',
    primary: 'bg-blue-100'
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="alertdialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0"
        onClick={() => !isLoading && onClose()}
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200 p-6 z-10 animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full shrink-0 ${bgMap[variant]}`}>
            {iconMap[variant]}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-gov-text-primary">{title}</h3>
            <p className="text-sm text-gov-text-secondary mt-1.5 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
