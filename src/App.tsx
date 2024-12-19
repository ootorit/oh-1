import React, { useState } from 'react';
import './App.css';
import Visualizer from './components/Visualizer';
import Knobs from './components/Knobs';
import Pads from './components/Pads';
import Buttons from './components/Buttons';
import Faders from './components/Faders';

// 状態の型定義
interface SynthState {
  knobs: { [key: string]: number };
  pads: { [key: string]: boolean };
  buttons: { [key: string]: boolean };
  faders: { [key: string]: number };
}

const App: React.FC = () => {
  // 全体の状態管理
  const [synthState, setSynthState] = useState<SynthState>({
    knobs: { attack: 20, decay: 40, sustain: 60 },
    pads: {},
    buttons: {},
    faders: { volume: 50, pan: 75 }
  });

  // ノブの値が変更されたとき
  const handleKnobChange = (knobId: string, value: number) => {
    setSynthState(prev => ({
      ...prev,
      knobs: { ...prev.knobs, [knobId]: value }
    }));
  };

  // パッドの状態が変更されたとき
  const handlePadChange = (padId: number, isActive: boolean) => {
    setSynthState(prev => ({
      ...prev,
      pads: { ...prev.pads, [padId]: isActive }
    }));
  };

  // ボタンの状態が変更されたとき
  const handleButtonChange = (buttonId: number, isActive: boolean) => {
    setSynthState(prev => ({
      ...prev,
      buttons: { ...prev.buttons, [buttonId]: isActive }
    }));
  };

  // フェーダーの値が変更されたとき
  const handleFaderChange = (faderId: string, value: number) => {
    setSynthState(prev => ({
      ...prev,
      faders: { ...prev.faders, [faderId]: value }
    }));
  };

  return (
    <div className="grid-wrapper">
      <div className="grid-container">
        <div className="grid-item visualizer">
          <Visualizer state={synthState} />
        </div>

        <div className="grid-item knobs">
          <Knobs
            values={synthState.knobs}
            onChange={handleKnobChange}
          />
        </div>

        <div className="grid-item pads">
          <Pads
            activeStates={synthState.pads}
            onPadTrigger={handlePadChange}
          />
        </div>

        <div className="grid-item buttons">
          <Buttons
            activeStates={synthState.buttons}
            onButtonChange={handleButtonChange}
          />
        </div>

        <div className="grid-item faders">
          <Faders
            values={synthState.faders}
            onChange={handleFaderChange}
          />
        </div>
      </div>
    </div>
  );
};

export default App;