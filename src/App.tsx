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
  [key: string]: number; // インデックスシグネチャを追加
}

// Faders用の具体的な型定義
interface FadersValues {
  volume: number;
  pan: number;
  [key: string]: number; // インデックスシグネチャを追加
}

// SynthStateの型定義を修正
interface SynthState {
  knobs: KnobsValues;
  pads: Record<number, boolean>; // 数値キーを許容
  buttons: Record<number, boolean>; // 数値キーを許容
  faders: FadersValues;
}

const App: React.FC = () => {
  // 全体の状態管理を具体的な型で初期化
  const [synthState, setSynthState] = useState<SynthState>({
    knobs: { attack: 20, decay: 40, sustain: 60 },
    pads: {}, // 初期値を必要に応じて設定
    buttons: {}, // 初期値を必要に応じて設定
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
  const handlePadChange = (padId: number, isActive: boolean) => { // padId を number に変更
    setSynthState(prev => ({
      ...prev,
      pads: { ...prev.pads, [padId]: isActive }
    }));
  };

  // ボタンの状態が変更されたときのハンドラ
  const handleButtonChange = (buttonId: number, isActive: boolean) => { // buttonId を number に変更
    setSynthState(prev => ({
      ...prev,
      buttons: { ...prev.buttons, [buttonId]: isActive }
    }));
  };

  // フェーダーの値が変更されたときのハンドラ
  const handleFaderChange = (faderId: string, value: number) => { // faderId を string に変更
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
