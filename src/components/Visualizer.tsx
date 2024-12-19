import React, { useRef, useEffect } from 'react';

interface VisualizerProps {
  state: {
    knobs: { [key: string]: number };
    pads: { [key: string]: boolean };
    buttons: { [key: string]: boolean };
    faders: { [key: string]: number };
  };
}

const Visualizer: React.FC<VisualizerProps> = ({ state }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // キャンバスのサイズをコンテナに合わせる
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 描画関数
    const draw = () => {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // グリッドの描画
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
      }
      for (let i = 0; i < canvas.height; i += 20) {
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
      }
      ctx.stroke();

      // ノブの値を表示
      ctx.fillStyle = 'white';
      ctx.font = '12px monospace';
      let y = 20;
      
      ctx.fillText('Knobs:', 10, y);
      y += 20;
      Object.entries(state.knobs).forEach(([key, value]) => {
        ctx.fillText(`${key}: ${Math.round(value)}`, 20, y);
        y += 20;
      });

      y += 10;
      ctx.fillText('Active Pads:', 10, y);
      y += 20;
      Object.entries(state.pads)
        .filter(([, isActive]) => isActive)
        .forEach(([padId]) => {
          ctx.fillText(`Pad ${padId}`, 20, y);
          y += 20;
        });

      y += 10;
      ctx.fillText('Active Buttons:', 10, y);
      y += 20;
      Object.entries(state.buttons)
        .filter(([, isActive]) => isActive)
        .forEach(([buttonId]) => {
          ctx.fillText(`Button ${buttonId}`, 20, y);
          y += 20;
        });

      y += 10;
      ctx.fillText('Faders:', 10, y);
      y += 20;
      Object.entries(state.faders).forEach(([key, value]) => {
        ctx.fillText(`${key}: ${Math.round(value)}`, 20, y);
        y += 20;
      });

      // 波形の描画
      ctx.strokeStyle = 'white';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      
      for (let x = 0; x < canvas.width; x++) {
        const normalizedX = x / canvas.width;
        const value = Object.values(state.faders)[0] / 100; // ボリュームフェーダーの値を使用
        const frequency = Object.values(state.knobs)[0] / 10; // アタックの値を周波数に使用
        
        const y = (canvas.height / 2) * 
                 (1 + value * Math.sin(normalizedX * frequency * Math.PI * 2 + Date.now() * 0.002));
        ctx.lineTo(x, y);
      }
      
      ctx.stroke();

      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [state]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      border: '1px solid rgb(255, 255, 255)',
      overflow: 'hidden',
      backgroundColor: 'transparent'
    }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
};

export default Visualizer;