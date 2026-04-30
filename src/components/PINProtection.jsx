import { useState, useEffect } from 'react';

const DEFAULT_PIN = '1234'; // Default PIN - parents can change this

export default function PINProtection({ onSuccess, onCancel }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);

  const handlePINSubmit = () => {
    if (pin === DEFAULT_PIN) {
      setError('');
      setPin('');
      onSuccess();
    } else {
      setError('Incorrect PIN. Try again.');
      setPin('');
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      // Lock after 3 failed attempts
      if (newAttempts >= 3) {
        setLocked(true);
        setTimeout(() => {
          setLocked(false);
          setAttempts(0);
          setError('');
        }, 30000); // 30 seconds lockout
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handlePINSubmit();
    }
  };

  const handleDigitClick = (digit) => {
    if (pin.length < 4 && !locked) {
      setPin(pin + digit);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  if (locked) {
    return (
      <div className="modal-overlay" onClick={onCancel}>
        <div className="modal-content pin-modal" onClick={e => e.stopPropagation()}>
          <h3>⏳ Too Many Attempts</h3>
          <p>Please try again in 30 seconds</p>
          <button className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content pin-modal" onClick={e => e.stopPropagation()}>
        <h3>🔐 Parent PIN Required</h3>
        <p>Enter 4-digit PIN to exit</p>

        {/* PIN Display */}
        <div className="pin-display">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="pin-dot"
              style={{
                backgroundColor: i < pin.length ? '#667eea' : '#e0e0e0'
              }}
            />
          ))}
        </div>

        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}

        {/* Number Pad */}
        <div className="number-pad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
            <button
              key={digit}
              className="num-btn"
              onClick={() => handleDigitClick(digit)}
              disabled={locked}
            >
              {digit}
            </button>
          ))}
          <button
            className="num-btn"
            onClick={() => handleDigitClick(0)}
            disabled={locked}
          >
            0
          </button>
          <button
            className="num-btn backspace-btn"
            onClick={handleBackspace}
            disabled={locked}
          >
            ⌫
          </button>
        </div>

        {/* Submit Button */}
        <button
          className="btn-primary"
          onClick={handlePINSubmit}
          disabled={pin.length !== 4 || locked}
        >
          Confirm
        </button>

        {/* Cancel Button */}
        <button className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>

        {/* Attempts Display */}
        <small className="attempts-display">
          {attempts > 0 && `Attempts remaining: ${3 - attempts}`}
        </small>
      </div>
    </div>
  );
}
