import { type RefObject, useEffect } from 'react';
export const AgentCanvas = ({
  mainCanvasRef,
  mainCtxRef,
}: {
  mainCanvasRef: RefObject<HTMLCanvasElement | null>;
  mainCtxRef: RefObject<CanvasRenderingContext2D | null>;
}) => {
  useEffect(() => {
    if (mainCanvasRef.current) {
      mainCtxRef.current = mainCanvasRef.current.getContext('2d');
    }
  }, [mainCanvasRef, mainCtxRef]);

  return (
    <div className="fixed inset-0 z-0 bg-black">
      <canvas ref={mainCanvasRef} className="block w-full h-full" />
    </div>
  );
};
