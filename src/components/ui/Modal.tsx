import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  // Footer actions
  onSave?: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  isSaving?: boolean;
  saveDisabled?: boolean;
  saveVariant?: 'primary' | 'danger' | 'success';
  hideFooter?: boolean;
  footerExtra?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = 'lg',
  onSave,
  saveLabel = 'Save Changes',
  cancelLabel = 'Cancel',
  isSaving = false,
  saveDisabled = false,
  saveVariant = 'primary',
  hideFooter = false,
  footerExtra
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSaving) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isSaving, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-5xl',
    full: 'max-w-6xl'
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="fixed inset-0"
        onClick={() => !isSaving && onClose()}
        aria-hidden="true"
      />
      
      <div
        className={`relative w-full ${sizeClasses[size]} my-auto bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] z-10 animate-in zoom-in-95 duration-150`}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Standard Header */}
        <div className="px-6 py-4 border-b border-gov-border flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 id="modal-title" className="text-base sm:text-lg font-bold text-gov-text-primary">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-gov-text-secondary mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gov-primary"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Standard Scrollable Content */}
        <div className="px-6 py-5 overflow-y-auto flex-1">
          {children}
        </div>

        {/* Modal Standard Footer */}
        {!hideFooter && (
          <div className="px-6 py-4 bg-slate-50 border-t border-gov-border flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
            <div>
              {footerExtra}
            </div>
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSaving}
                className="w-full sm:w-auto"
              >
                {cancelLabel}
              </Button>
              {onSave && (
                <Button
                  type="button"
                  variant={saveVariant}
                  onClick={onSave}
                  isLoading={isSaving}
                  disabled={saveDisabled || isSaving}
                  className="w-full sm:w-auto"
                >
                  {saveLabel}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
