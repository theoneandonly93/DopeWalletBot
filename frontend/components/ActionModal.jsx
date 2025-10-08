import React, { useState } from 'react';

export default function ActionModal({ open, type, onClose, onSubmit }) {
  const [form, setForm] = useState({ amount: '', to: '' });

  if (!open) return null;

  const titleMap = { buy: 'Buy', send: 'Send', receive: 'Receive' };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-neutral text-white rounded-md w-[90%] max-w-md p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">{titleMap[type]} Token</h3>
          <button className="btn btn-xs btn-ghost text-white" onClick={onClose}>✕</button>
        </div>
        <div className="space-y-3">
          {type !== 'receive' && (
            <input
              className="input input-bordered w-full bg-gray-800 text-white"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) => setForm((s) => ({ ...s, amount: e.target.value }))}
            />
          )}
          {type === 'send' && (
            <input
              className="input input-bordered w-full bg-gray-800 text-white"
              placeholder="Destination address"
              value={form.to}
              onChange={(e) => setForm((s) => ({ ...s, to: e.target.value }))}
            />
          )}
          {type === 'receive' && (
            <p className="text-sm text-gray-300">Share this public address to receive funds.</p>
          )}
          <div className="flex justify-end gap-2">
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button
              className="btn btn-primary"
              onClick={() => {
                onSubmit && onSubmit({ type, form });
                onClose();
              }}
            >
              {titleMap[type]}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
