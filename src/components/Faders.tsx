import React, { useRef, useEffect } from 'react';

interface FaderProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
  label: string;
}

const Fader: React.FC<FaderProps> = ({ value, onChange, label }) => {
  const faderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !faderRef.current) return;
      
      const rect = faderRef.current.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const height = rect.height;
      const percentage = 100 - (y / height * 100);
      const clampedValue = Math.min(Math.max(percentage, 0), 100);
      
      onChange(Math.round(clampedValue));
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!faderRef.current) return;
    
    isDragging.current = true;
    const rect = faderRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;
    const percentage = 100 - (y / height * 100);
    const clampedValue = Math.min(Math.max(percentage, 0), 100);
    
    onChange(Math.round(clampedValue));
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100%',
      boxSizing: 'border-box'
    }}>
      <div 
        ref={faderRef}
        style={{
          flex: 1,
          width: '4px',
          backgroundColor: 'rgb(255, 255, 255)',
          position: 'relative',
          cursor: 'pointer',
          margin: '20px 0'
        }}
        onMouseDown={handleMouseDown}
      >
        <div
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