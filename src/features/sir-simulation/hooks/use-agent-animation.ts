import type { RefObject } from "react";
import { useEffect, useRef } from "react";
import { createAnimator } from "../logic/animator";
import { useSimStore } from "../state/store";

export const useAgentAnimation = ({
    mainCanvasRef,
    mainCtxRef,
}: {
    mainCanvasRef: RefObject<HTMLCanvasElement | null>;
    mainCtxRef: RefObject<CanvasRenderingContext2D | null>;
}) => {
    const animatorRef = useRef<ReturnType<typeof createAnimator> | null>(null);

    useEffect(() => {
        const canvas = mainCanvasRef.current;
        const ctx = mainCtxRef.current;
        if (!canvas || !ctx) return;

        // 初期化
        const w = window.innerWidth;
        const h = window.innerHeight;
        canvas.width = w;
        canvas.height = h;
        const simStore = useSimStore.getState();
        simStore.reset({ width: w, height: h });

        const animator = createAnimator(
            /** ここがループする */
            (
                _dt, /** 1フレームの時間（秒） */
                _dtmTimeSec, /** シミュレーション時間（秒） */
            ) => {
                // 毎フレーム最新のstoreを取得
                const store = useSimStore.getState();
                const agents = store.agents;

                // クリア
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                // エージェントを更新
                agents.forEach((agent) => {
                    agent.update(
                        canvas,
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
    }, [mainCanvasRef, mainCtxRef]);

    return animatorRef;
};
