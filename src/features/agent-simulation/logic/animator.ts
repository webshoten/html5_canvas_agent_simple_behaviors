export type StepFn = (dtSec: number, simTimeSec: number) => void;

/**
 * Canvasを動的に表現させる際のループ(60fps)
 * @param step ループ　させたい中身CallBack
 * @returns
 */
export function createAnimator(step: StepFn) {
    let lastTs: number | null = null;
    let simTimeSec = 0;
    let rafId: number | null = null;

    const loop = (ts: number) => {
        if (lastTs == null) lastTs = ts;
        const dt = Math.max(0, (ts - lastTs) / 1000); // 1フレームの時間（秒） 1000で割ることでミリ秒を秒に変換
        lastTs = ts;
        simTimeSec += dt;

        step(dt, simTimeSec); // ループ　させたい中身CallBack

        /** 次のフレームを描画 */
        rafId = requestAnimationFrame(loop);
    };

    return {
        /** 最初のフレームを描画 */
        start() {
            if (rafId != null) return;
            /** 最初のフレームを描画 */
            rafId = requestAnimationFrame(loop);
        },
        stop() {
            /** ループを停止 */
            if (rafId != null) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
            lastTs = null;
            simTimeSec = 0;
        },
    };
}
