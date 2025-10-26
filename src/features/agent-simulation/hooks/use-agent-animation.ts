import type { RefObject } from "react";
import { useEffect, useRef } from "react";
import { createAnimator } from "../logic/animator";
import { useStore } from "../state/store";
import { useCanvasDpr } from "./use-canvas-dpr";

export const useAgentAnimation = ({
    mainCanvasRef,
    mainCtxRef,
}: {
    mainCanvasRef: RefObject<HTMLCanvasElement | null>;
    mainCtxRef: RefObject<CanvasRenderingContext2D | null>;
}) => {
    const animatorRef = useRef<ReturnType<typeof createAnimator> | null>(null);
    const canvasSize = useStore((state) => state.canvasSize);

    // DPR対応（高解像度ディスプレイ対応） + 画面サイズ取得・store更新
    useCanvasDpr({
        canvasRef: mainCanvasRef,
        ctxRef: mainCtxRef,
    });

    useEffect(() => {
        const canvas = mainCanvasRef.current;
        const ctx = mainCtxRef.current;
        if (!canvas || !ctx || canvasSize.width === 0) return;

        // シミュレーション初期化（論理サイズで）
        const simStore = useStore.getState();
        simStore.reset({ width: canvasSize.width, height: canvasSize.height });

        const animator = createAnimator(
            /** ここがループする */
            (
                _dt, /** 1フレームの時間（秒） */
                _dtmTimeSec, /** シミュレーション時間（秒） */
            ) => {
                // 毎フレーム最新のstoreを取得
                const store = useStore.getState();
                const agents = store.agents;

                // クリア（論理サイズでクリア）
                ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
                // エージェントを更新（論理サイズで境界判定）
                agents.forEach((agent) => {
                    agent.update(
                        canvasSize.width,
                        canvasSize.height,
                        ctx,
                        store.config.color,
                    );
                });
            },
        );

        /** createAnimatorの引数がループする */
        animator.start(); /** 最初のフレームを描画 */
        animatorRef.current = animator;
        return () =>
            animator.stop(); /** ループを停止(animatorRefが停止される) */
    }, [mainCanvasRef, mainCtxRef, canvasSize]);

    return animatorRef;
};
