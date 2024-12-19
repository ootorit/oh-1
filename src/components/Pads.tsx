import React from 'react';

interface PadProps {
  id: number;
  active: boolean;
  onTrigger: (isActive: boolean) => void;
}

const Pad: React.FC<PadProps> = ({ id, active, onTrigger }) => {
  return (
    <div
      onMouseDown={() => onTrigger(true)}
      onMouseUp={() => onTrigger(false)}
      onMouseLeave={() => onTrigger(false)}
      onTouchStart={(e) => {
        e.preventDefault();
        onTrigger(true);
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        onTrigger(false);
      }}
      style={{
        border: '1px solid rgb(255, 255, 255)',
        backgroundColor: active ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
        transition: 'background-color 0.1s ease',
        cursor: 'pointer',
        userSelect: 'none',
        touchAction: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box'
      }}
    >
      <span style={{ color: 'rgb(255, 255, 255)' }}>
        {id}
      </span>
    </div>
  );
};

interface PadsProps {
  activeStates: { [key: string]: boolean };
  onPadTrigger: (padId: number, isActive: boolean) => void;
}

const Pads: React.FC<PadsProps> = ({ activeStates, onPadTrigger }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gridTemplateRows: 'repeat(4, 1fr)',
      gap: '10px',
      padding: '10px',
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
      boxSizing: 'border-box'
    }}>
      {Array.from({ length: 16 }, (_, i) => (
        <Pad
          key={i + 1}
          id={i + 1}
          active={activeStates[i + 1] || false}
          onTrigger={(isActive) => onPadTrigger(i + 1, isActive)}
        />
      ))}
    </div>
  );
};

export default Pads;