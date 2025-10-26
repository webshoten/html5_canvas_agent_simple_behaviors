'use client';

import { useEffect, useRef } from 'react';
import { useAgentAnimation } from '../hooks/use-agent-animation';
import { useStore } from '../state/store';
import { AgentCanvas } from './agent-canvas';

export const AgentSimulationMain = () => {
  const mainCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const mainCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (mainCanvasRef.current) {
      mainCtxRef.current = mainCanvasRef.current.getContext('2d');
    }
  }, []);

  // エージェントアニメーションを描画
  const _animatorRef = useAgentAnimation({
    mainCanvasRef,
    mainCtxRef,
  });

  //configだけ監視
  const _config = useStore((state) => state.config);

  return <AgentCanvas mainCanvasRef={mainCanvasRef} mainCtxRef={mainCtxRef} />;
};
