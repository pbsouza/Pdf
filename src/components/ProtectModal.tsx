import React from 'react';
import { X, Lock, Shield, Key } from 'lucide-react';
import { PdfDocument } from '../types/pdf';

interface ProtectModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: PdfDocument;
  onApplyProtection: (userPass: string, ownerPass: string) => void;
}

export const ProtectModal: React.FC<ProtectModalProps> = ({
  isOpen,
  onClose,
  document,
  onApplyProtection,
}) => {
  const [userPassword, setUserPassword] = React.useState('');
  const [ownerPassword, setOwnerPassword] = React.useState('');
  const [restrictPrinting, setRestrictPrinting] = React.useState(false);
  const [restrictCopying, setRestrictCopying] = React.useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPassword.trim() && !ownerPassword.trim()) {
      alert('Please enter at least a document opening password or permissions password.');
      return;
    }
    onApplyProtection(userPassword, ownerPassword);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-850 rounded-xl shadow-2xl border border-neutral-300 dark:border-neutral-700 w-full max-w-md overflow-hidden flex flex-col text-xs">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-[#b70228]" />
            <span className="font-semibold text-sm text-neutral-800 dark:text-neutral-100">
              Protect Document
            </span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded text-neutral-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-neutral-500">
            Encrypt this PDF using the standard ISO 32000 security handler (AES-256).
          </p>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-300 font-medium mb-1">
              Document Open Password
            </label>
            <input
              type="password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              placeholder="Requires password to open..."
              className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded px-2.5 py-1.5 outline-none focus:border-[#b70228]"
            />
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-300 font-medium mb-1">
              Permissions / Master Password
            </label>
            <input
              type="password"
              value={ownerPassword}
              onChange={(e) => setOwnerPassword(e.target.value)}
              placeholder="Required to change permissions or security..."
              className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded px-2.5 py-1.5 outline-none focus:border-[#b70228]"
            />
          </div>

          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 space-y-2">
            <div className="font-medium text-neutral-700 dark:text-neutral-300">Restrictions</div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={restrictPrinting}
                onChange={(e) => setRestrictPrinting(e.target.checked)}
                className="rounded text-[#b70228] focus:ring-[#b70228]"
              />
              <span className="text-neutral-600 dark:text-neutral-400">Restrict high-resolution printing</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={restrictCopying}
                onChange={(e) => setRestrictCopying(e.target.checked)}
                className="rounded text-[#b70228] focus:ring-[#b70228]"
              />
              <span className="text-neutral-600 dark:text-neutral-400">Restrict text & graphics copying</span>
            </label>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-neutral-200 dark:border-neutral-700 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-700 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-[#b70228] hover:bg-[#8a011e] text-white font-medium"
            >
              Apply Security
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
