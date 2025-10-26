/**
 * Agent Simulation Web Worker
 * 描画処理をメインスレッドから分離して実行
 */

import type { Agent } from "../logic/agent";
import { createPopulation } from "../logic/create-population";
import type { ConfigType } from "../state/store";
import { createAgentAnimator, type WorkerAnimator } from "./worker-animator";

// ========================================
// Workerのメッセージ型定義
// ========================================
type WorkerMessage =
    | {
        type: "init";
        canvas: OffscreenCanvas;
        canvasSize: { width: number; height: number };
        dpr: number;
        config: ConfigType;
    }
    | { type: "start" }
    | { type: "stop" };

// Worker内部の状態
let offscreenCanvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;
let canvasSize = { width: 0, height: 0 };
let config: ConfigType = {
    populationN: 100,
    agentRadius: 10,
    color: "hsl(210 80% 60%)",
    velocity: { minSpeed: 0.5, maxSpeed: 2.0 },
};
let agents: Agent[] = [];
let animator: WorkerAnimator | null = null;

// Worker起動確認
console.log("[Worker] Agent Worker initialized");

// メインスレッドからのメッセージを受信
self.onmessage = (e: MessageEvent<WorkerMessage>) => {
    const message = e.data;
    console.log("[Worker] Received message:", message.type);

    switch (message.type) {
        case "init": {
            console.log("[Worker] Canvas received");
            offscreenCanvas = message.canvas;
            canvasSize = message.canvasSize;
            config = message.config;
            const dpr = message.dpr;

            // コンテキストを取得
            ctx = offscreenCanvas.getContext("2d");
            if (!ctx) {
                console.error("[Worker] Failed to get 2D context");
                return;
            }

            // DPRスケーリングを適用
            ctx.scale(dpr, dpr);

            console.log("[Worker] Canvas initialized", {
                physical: {
                    width: offscreenCanvas.width,
                    height: offscreenCanvas.height,
                },
                logical: canvasSize,
                dpr,
                config,
            });

            // エージェント生成
            agents = createPopulation({
                width: canvasSize.width,
                height: canvasSize.height,
                config,
            });

            console.log("[Worker] Agents created:", agents.length);

            // アニメーター作成
            animator = createAgentAnimator({
                ctx,
                canvasSize,
                agents,
                config,
            });

            console.log("[Worker] Canvas setup complete");
            self.postMessage({ type: "initialized" });

            // アニメーション自動開始
            animator.start();
            break;
        }

        case "start":
            console.log("[Worker] Animation start requested");
            animator?.start();
            break;

        case "stop":
            console.log("[Worker] Animation stop requested");
            animator?.stop();
            break;
    }
};

// メインスレッドにメッセージを送信（確認用）
self.postMessage({ type: "ready" });
