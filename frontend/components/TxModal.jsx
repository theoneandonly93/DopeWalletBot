import { useEffect, useState } from 'react';

export default function TxModal({ open, onClose, txHash, status, message }){
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-bg rounded-xl p-4 w-11/12 max-w-md">
        <h3 className="text-lg font-semibold">Transaction</h3>
        <div className="mt-3">
          <p className="text-sm text-textDim">{message || 'Sending transaction...'}</p>
          {txHash && (
            <p className="text-xs mt-2 break-all">Hash: <a className="text-[#3B82F6]" target="_blank" rel="noreferrer" href={`https://bscscan.com/tx/${txHash}`}>{txHash}</a></p>
          )}
          <div className="mt-4 flex justify-end">
            <button onClick={onClose} className="btn btn-ghost">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
