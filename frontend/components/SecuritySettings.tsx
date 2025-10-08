"use client";
import { useState, useEffect } from 'react';
import { encryptPasscode, storePasscode, getStoredPasscode } from '../lib/security';
import { startRegistration } from 'react-web-authn';

export default function SecuritySettings({ onBack }){
  const [passcode, setPasscode] = useState('');
  const [faceEnabled, setFaceEnabled] = useState(false);
  const [hasPasscode, setHasPasscode] = useState(false);

  useEffect(()=>{
    if (getStoredPasscode()) setHasPasscode(true);
  }, []);

  const handleSetPasscode = ()=>{
    if (passcode.length < 4) return alert('Passcode must be at least 4 digits');
    const encrypted = encryptPasscode(passcode);
    storePasscode(encrypted);
    setHasPasscode(true);
    alert('Passcode set successfully');
  };

  const handleFaceSetup = async ()=>{
    try{
      await startRegistration({ user: { id: 'user1', name: 'DopeWalletUser' }, challenge: 'dopelchallenge' });
      setFaceEnabled(true);
      alert('Face ID registered');
    }catch(err){ console.error(err); alert('Face ID setup failed'); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-blue-400 text-sm">← Back</button>
        <h2 className="text-white text-base font-semibold">Passcode & Face ID</h2>
        <div className="w-6" />
      </div>

      {!hasPasscode ? (
        <div className="space-y-4">
          <input type="password" maxLength={6} value={passcode} onChange={(e)=>setPasscode(e.target.value)} placeholder="Enter new passcode" className="w-full bg-[#111] p-3 rounded-xl text-white text-center" />
          <button onClick={handleSetPasscode} className="w-full py-3 bg-blue-500 rounded-xl text-white font-semibold">Save Passcode</button>
        </div>
      ) : (
        <div className="space-y-4">
          <button onClick={handleFaceSetup} className="w-full py-3 bg-[#111] text-white rounded-xl border border-[#333]">{faceEnabled ? 'Disable Face ID' : 'Enable Face ID'}</button>
          <p className="text-gray-400 text-xs text-center">Face ID uses WebAuthn for secure biometric unlock.</p>
        </div>
      )}
    </div>
  );
}
