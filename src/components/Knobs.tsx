import React, { useRef, useEffect, useCallback } from 'react';

// イベントハンドラーの型定義
type TouchEventHandler = (event: TouchEvent) => void;
type MouseEventHandler = (event: MouseEvent) => void;

interface KnobProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const Knob: React.FC<KnobProps> = ({ label, value, onChange }) => {
  const knobRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const rotationRef = useRef((value / 100) * 270 - 135);
  const startYRef = useRef(0);
  const startValueRef = useRef(0);

  useEffect(() => {
    if (!isDraggingRef.current) {
      rotationRef.current = (value / 100) * 270 - 135;
      if (knobRef.current) {
        knobRef.current.style.transform = `rotate(${rotationRef.current}deg)`;
      }
    }
  }, [value]);

  const handleStart = useCallback((clientY: number) => {
    isDraggingRef.current = true;
    startYRef.current = clientY;
    startValueRef.current = value;
  }, [value]);

  const handleMove = useCallback((clientY: number) => {
    if (!isDraggingRef.current) return;

    const deltaY = startYRef.current - clientY;
    const sensitivity = 0.5;
    const valueDelta = deltaY * sensitivity;
    const newValue = Math.min(Math.max(startValueRef.current + valueDelta, 0), 100);
    
    rotationRef.current = (newValue / 100) * 270 - 135;
    if (knobRef.current) {
      knobRef.current.style.transform = `rotate(${rotationRef.current}deg)`;
    }
    onChange(Math.round(newValue));
  }, [onChange]);

  const handleEnd = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  // マウスイベントハンドラー
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
    const knob = knobRef.current;
    if (!knob) return;

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

    knob.addEventListener('touchstart', touchStartHandler);
    knob.addEventListener('touchmove', touchMoveHandler);
    knob.addEventListener('touchend', touchEndHandler);

    return () => {
      knob.removeEventListener('touchstart', touchStartHandler);
      knob.removeEventListener('touchmove', touchMoveHandler);
      knob.removeEventListener('touchend', touchEndHandler);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleStart, handleMove, handleEnd, handleMouseMove, handleMouseUp]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div 
        ref={knobRef}
        onMouseDown={handleMouseDown}
        style={{
          width: '60px',
          height: '60px',
          position: 'relative',
          border: '1px solid rgb(255, 255, 255)',
          borderRadius: '50%',
          transform: `rotate(${rotationRef.current}deg)`,
          cursor: 'pointer',
          backgroundColor: 'transparent',
          touchAction: 'none',
          userSelect: 'none'
        }}
      >
        <div style={{
          position: 'absolute',
          width: '1px',
          height: '20px',
          backgroundColor: 'rgb(255, 255, 255)',
          top: '4px',
          left: '50%',
          transform: 'translateX(-50%)',
          transformOrigin: 'bottom'
        }} />
      </div>
      <div style={{ 
        color: 'rgb(255, 255, 255)',
        fontSize: '12px',
        marginTop: '8px',
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

interface KnobsProps {
  values: {
    attack: number;
    decay: number;
    sustain: number;
  };
  onChange: (parameter: keyof KnobsProps['values'], value: number) => void;
}

const Knobs: React.FC<KnobsProps> = ({ values, onChange }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '10px',
      padding: '10px',
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
      boxSizing: 'border-box'
    }}>
      <Knob 
        label="Attack" 
        value={values.attack || 0}
        onChange={(value) => onChange('attack', value)} 
      />
      <Knob 
        label="Decay" 
        value={values.decay || 0}
        onChange={(value) => onChange('decay', value)} 
      />
      <Knob 
        label="Sustain" 
        value={values.sustain || 0}
        onChange={(value) => onChange('sustain', value)} 
      />
    </div>
  );
};

export default Knobs;