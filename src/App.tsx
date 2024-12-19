// src/App.tsx
import React, { useState } from 'react';
import './App.css';
import Visualizer from './components/Visualizer';
import Knobs from './components/Knobs';
import Pads from './components/Pads';
import Buttons from './components/Buttons';
import Faders from './components/Faders';

// Knobs用の具体的な型定義
interface KnobsValues {
  attack: number;
  decay: number;
  sustain: number;
}

// Faders用の具体的な型定義
interface FadersValues {
  volume: number;
  pan: number;
}

// SynthStateの型定義を修正
interface SynthState {
  knobs: KnobsValues;
  pads: { [key: string]: boolean };
  buttons: { [key: string]: boolean };
  faders: FadersValues;
}

const App: React.FC = () => {
  // 全体の状態管理を具体的な型で初期化
  const [synthState, setSynthState] = useState<SynthState>({
    knobs: { attack: 20, decay: 40, sustain: 60 },
    pads: {}, // 必要に応じて初期値を設定
    buttons: {}, // 必要に応じて初期値を設定
    faders: { volume: 50, pan: 75 }
  });

  // ノブの値が変更されたときのハンドラ
  const handleKnobChange = (knobId: keyof KnobsValues, value: number) => {
    setSynthState(prev => ({
      ...prev,
      knobs: { ...prev.knobs, [knobId]: value }
    }));
  };

  // パッドの状態が変更されたときのハンドラ
  const handlePadChange = (padId: string, isActive: boolean) => {
    setSynthState(prev => ({
      ...prev,
      pads: { ...prev.pads, [padId]: isActive }
    }));
  };

  // ボタンの状態が変更されたときのハンドラ
  const handleButtonChange = (buttonId: string, isActive: boolean) => {
    setSynthState(prev => ({
      ...prev,
      buttons: { ...prev.buttons, [buttonId]: isActive }
    }));
  };

  // フェーダーの値が変更されたときのハンドラ
  const handleFaderChange = (faderId: keyof FadersValues, value: number) => {
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
