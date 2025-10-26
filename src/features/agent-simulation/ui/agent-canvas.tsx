import { type RefObject, useEffect } from 'react';

export const AgentCanvas = ({
  mainCanvasRef,
  mainCtxRef,
}: {
  mainCanvasRef: RefObject<HTMLCanvasElement | null>;
  mainCtxRef: RefObject<
    CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null
  >;
}) => {
  useEffect(() => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;

    // OffscreenCanvasを作成
    const offscreen = canvas.transferControlToOffscreen();

    // OffscreenCanvasのコンテキストを取得
    mainCtxRef.current = offscreen.getContext('2d');
  }, [mainCanvasRef, mainCtxRef]);

  return (
    <div className="fixed inset-0 z-0 bg-black">
      <canvas ref={mainCanvasRef} className="block w-full h-full" />
    </div>
  );
};
