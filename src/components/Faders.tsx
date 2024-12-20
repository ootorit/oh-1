import React, { useRef, useCallback, useEffect } from 'react';

// イベントハンドラーの型定義
type TouchEventHandler = (event: TouchEvent) => void;
type MouseEventHandler = (event: MouseEvent) => void;

interface FaderProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
  label: string;
}

const Fader: React.FC<FaderProps> = ({ value, onChange, label }) => {
  const faderRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const calculateValue = useCallback((clientY: number) => {
    if (!faderRef.current) return value;
    const rect = faderRef.current.getBoundingClientRect();
    const y = clientY - rect.top;
    const height = rect.height;
    const percentage = 100 - (y / height * 100);
    return Math.min(Math.max(percentage, 0), 100);
  }, [value]);

  const handleStart = useCallback((clientY: number) => {
    isDraggingRef.current = true;
    const newValue = calculateValue(clientY);
    onChange(Math.round(newValue));
  }, [calculateValue, onChange]);

  const handleMove = useCallback((clientY: number) => {
    if (!isDraggingRef.current) return;
    const newValue = calculateValue(clientY);
    onChange(Math.round(newValue));
  }, [calculateValue, onChange]);

  const handleEnd = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleStart(e.clientY);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [handleStart]);

  const handleMouseMove = useCallback<MouseEventHandler>((e) => {
    handleMove(e.clientY);
  }, [handleMove]);

  const handleMouseUp = useCallback(() => {
    handleEnd();
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleEnd, handleMouseMove]);

  useEffect(() => {
    const fader = faderRef.current;
    if (!fader) return;

    const touchStartHandler: TouchEventHandler = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleStart(touch.clientY);
    };

    const touchMoveHandler: TouchEventHandler = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleMove(touch.clientY);
    };

    const touchEndHandler: TouchEventHandler = (e) => {
      e.preventDefault();
      handleEnd();
    };

    fader.addEventListener('touchstart', touchStartHandler);
    fader.addEventListener('touchmove', touchMoveHandler);
    fader.addEventListener('touchend', touchEndHandler);

    return () => {
      if (!fader) return;
      fader.removeEventListener('touchstart', touchStartHandler);
      fader.removeEventListener('touchmove', touchMoveHandler);
      fader.removeEventListener('touchend', touchEndHandler);
    };
  }, [handleStart, handleMove, handleEnd]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100%',
      boxSizing: 'border-box',
      touchAction: 'none'
    }}>
      <div 
        ref={faderRef}
        onMouseDown={handleMouseDown}
        style={{
          flex: 1,
          width: '4px',
          backgroundColor: 'rgb(255, 255, 255)',
          position: 'relative',
          cursor: 'pointer',
          margin: '20px 0'
        }}
      >
        <div
          ref={handleRef}
          style={{
            width: '20px',
            height: '20px',
            backgroundColor: 'transparent',
            border: '1px solid rgb(255, 255, 255)',
            borderRadius: '50%',
            position: 'absolute',
            left: '50%',
            bottom: `${value}%`,
            transform: 'translateX(-50%)',
            cursor: 'pointer'
          }}
        />
      </div>
      <div style={{
        color: 'rgb(255, 255, 255)',
        fontSize: '12px',
        textAlign: 'center'
      }}>
        {label}
        <div style={{ fontSize: '10px', opacity: 0.7 }}>
          {Math.round(value)}
        </div>
      </div>
    </div>
  );
};

interface FadersProps {
  values: { [key: string]: number };
  onChange: (faderId: string, value: number) => void;
}

const Faders: React.FC<FadersProps> = ({ values, onChange }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '10px',
      padding: '10px',
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
      boxSizing: 'border-box'
    }}>
      <Fader
        id="volume"
        value={values.volume || 0}
        onChange={(value) => onChange('volume', value)}
        label="Volume"
      />
      <Fader
        id="pan"
        value={values.pan || 0}
        onChange={(value) => onChange('pan', value)}
        label="Pan"
      />
    </div>
  );
};

export default Faders;