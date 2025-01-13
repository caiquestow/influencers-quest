// src/components/APIKeyModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { saveApiKey, getApiKey } from '@/lib/cryptoUtils';

interface APIKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function APIKeyModal({ isOpen, onClose }: APIKeyModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Só pega a API key após o componente montar no cliente
    const storedApiKey = getApiKey();
    setApiKey(storedApiKey);
  }, []);

  const handleSave = () => {
    if (isClient && apiKey.trim()) {
      saveApiKey(apiKey.trim());
      onClose();
    }
  };

  // Se não for cliente ou modal fechado, não renderiza nada
  if (!isClient || !isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="rounded-lg bg-slate-800 p-6 w-[500px] text-white">
        <h3 className="text-lg font-medium mb-4">Configure AI API Key</h3>

        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">
            API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full rounded-lg bg-slate-900/90 border border-slate-800/60 px-4 py-2.5 text-sm text-slate-400"
            placeholder="Enter your AI API key"
          />
          <p className="mt-2 text-xs text-slate-500">
            Your API key will be encrypted and stored locally.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-400 hover:text-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white"
          >
            Save API Key
          </button>
        </div>
      </div>
    </div>
  );
}