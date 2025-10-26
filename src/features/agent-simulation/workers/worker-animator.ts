/**
 * Worker用アニメーター
 * OffscreenCanvasのアニメーションループを管理
 */

import type { Agent } from "../logic/agent";
import type { ConfigType } from "../state/store";

type AnimatorState = {
    rafId: number | null;
    lastTs: number | null;
    simTimeSec: number;
};

type AnimationCallback = (dt: number, simTimeSec: number) => void;

export class WorkerAnimator {
    private state: AnimatorState = {
        rafId: null,
        lastTs: null,
        simTimeSec: 0,
    };

    private callback: AnimationCallback | null = null;

    constructor(callback: AnimationCallback) {
        this.callback = callback;
    }

    private loop = (ts: number) => {
        if (this.state.lastTs == null) this.state.lastTs = ts;
        const dt = Math.max(0, (ts - this.state.lastTs) / 1000);
        this.state.lastTs = ts;
        this.state.simTimeSec += dt;

        // コールバック実行
        if (this.callback) {
            this.callback(dt, this.state.simTimeSec);
        }

        // 次のフレームをリクエスト
        this.state.rafId = requestAnimationFrame(this.loop);
    };

    start() {
        if (this.state.rafId != null) return; // 既に実行中
        console.log("[WorkerAnimator] Starting animation loop");
        this.state.lastTs = null;
        this.state.simTimeSec = 0;
        this.state.rafId = requestAnimationFrame(this.loop);
    }

    stop() {
        if (this.state.rafId != null) {
            cancelAnimationFrame(this.state.rafId);
            this.state.rafId = null;
        }
        this.state.lastTs = null;
        this.state.simTimeSec = 0;
        console.log("[WorkerAnimator] Animation stopped");
    }

    isRunning(): boolean {
        return this.state.rafId != null;
    }
}

/**
 * エージェントアニメーション用のヘルパー
 */
export function createAgentAnimator({
    ctx,
    canvasSize,
    agents,
    config,
}: {
    ctx: OffscreenCanvasRenderingContext2D;
    canvasSize: { width: number; height: number };
    agents: Agent[];
    config: ConfigType;
}): WorkerAnimator {
    const animator = new WorkerAnimator(() => {
        // クリア
        ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

        // エージェントを更新・描画
        agents.forEach((agent) => {
            agent.update(
                canvasSize.width,
                canvasSize.height,
                ctx,
                config.color,
            );
        });
    });

    return animator;
}
