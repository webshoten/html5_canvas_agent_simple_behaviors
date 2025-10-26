'use client';

import { useRef } from 'react';
import { useAgentAnimation } from '../hooks/use-agent-animation';
import { useStore } from '../state/store';
import { AgentCanvas } from './agent-canvas';

export const AgentSimulationMain = () => {
  const mainCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenRef = useRef<OffscreenCanvas | null>(null);

  // エージェントアニメーションを描画
  const _animatorRef = useAgentAnimation({
    mainCanvasRef,
    offscreenRef,
  });

  //configだけ監視
  const _config = useStore((state) => state.config);

  return (
    <AgentCanvas mainCanvasRef={mainCanvasRef} offscreenRef={offscreenRef} />
  );
};
