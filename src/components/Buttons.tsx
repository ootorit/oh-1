import React from 'react';

interface ButtonProps {
  id: number;
  active: boolean;
  onClick: () => void;
  label?: string;
}

const Button: React.FC<ButtonProps> = ({ id, active, onClick, label }) => {
  return (
    <div
      onClick={onClick}
      style={{
        border: '1px solid rgb(255, 255, 255)',
        borderRadius: '4px',
        backgroundColor: active ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
        color: 'rgb(255, 255, 255)',
        padding: '10px',
        cursor: 'pointer',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.1s ease',
        height: '100%',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {label || `Btn ${id}`}
    </div>
  );
};

interface ButtonsProps {
  activeStates: { [key: string]: boolean };
  onButtonChange: (buttonId: number, isActive: boolean) => void;
}

const Buttons: React.FC<ButtonsProps> = ({ activeStates, onButtonChange }) => {
  const handleButtonClick = (id: number) => {
    onButtonChange(id, !activeStates[id]);
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gridTemplateRows: 'repeat(4, 1fr)',
      gap: '10px',
      padding: '10px',
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
      boxSizing: 'border-box'
    }}>
      {Array.from({ length: 8 }, (_, i) => (
        <Button
          key={i + 1}
          id={i + 1}
          active={activeStates[i + 1] || false}
          onClick={() => handleButtonClick(i + 1)}
        />
      ))}
    </div>
  );
};

export default Buttons;