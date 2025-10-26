import type { RefObject } from 'react';
import { useCanvasDpr } from '../hooks/use-canvas-dpr';
import { useStore } from '../state/store';

export const AgentCanvas = ({
  mainCanvasRef,
  offscreenRef,
}: {
  mainCanvasRef: RefObject<HTMLCanvasElement | null>;
  offscreenRef: RefObject<OffscreenCanvas | null>;
}) => {
  const canvasSize = useStore((state) => state.canvasSize);

  // DPR対応（HTMLCanvasのCSSサイズのみ管理）
  useCanvasDpr({
    canvasRef: mainCanvasRef,
  });

  // canvasSizeが変わったらcanvas要素を再作成（keyで制御）
  const canvasKey = `${canvasSize.width}-${canvasSize.height}`;

  return (
    <div className="fixed inset-0 z-0 bg-black">
      <canvas
        key={canvasKey}
        ref={mainCanvasRef}
        className="block w-full h-full"
      />
    </div>
  );
};
