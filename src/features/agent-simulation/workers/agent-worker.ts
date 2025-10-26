/**
 * Agent Simulation Web Worker
 * 描画処理をメインスレッドから分離して実行
 */

// ========================================
// 型定義
// ========================================
type Vector2 = { x: number; y: number };

type ConfigType = {
    populationN: number;
    agentRadius: number;
    color: string;
    velocity: { minSpeed: number; maxSpeed: number };
};

// ========================================
// Agent クラス
// ========================================
class Agent {
    x: number;
    y: number;
    radius: number;
    color: string;
    velocity: Vector2;
    infectedAt: number | null;

    constructor(
        x: number,
        y: number,
        radius: number,
        color: string,
        velocity: Vector2,
    ) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.infectedAt = null;
    }

    draw(
        c: OffscreenCanvasRenderingContext2D,
        color: string,
    ): void {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = color;
        c.fill();
    }

    update(
        width: number,
        height: number,
        c: OffscreenCanvasRenderingContext2D,
        color: string,
    ) {
        // 位置を更新
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // 周期境界条件（半径込み）- 論理サイズで判定
        if (this.x < -this.radius) this.x = width + this.radius;
        if (this.x > width + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = height + this.radius;
        if (this.y > height + this.radius) this.y = -this.radius;

        // 描画
        this.draw(c, color);
    }
}

// ========================================
// エージェント生成関数
// ========================================
function createPopulation({
    width,
    height,
    config,
}: {
    width: number;
    height: number;
    config: ConfigType;
}): Agent[] {
    const agents: Agent[] = [];
    const { populationN, agentRadius, color, velocity } = config;

    for (let i = 0; i < populationN; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const speed = velocity.minSpeed +
            Math.random() * (velocity.maxSpeed - velocity.minSpeed);
        const angle = Math.random() * Math.PI * 2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        agents.push(new Agent(x, y, agentRadius, color, { x: vx, y: vy }));
    }

    return agents;
}

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

// アニメーション状態
let rafId: number | null = null;
let lastTs: number | null = null;
let _simTimeSec = 0;

// Worker起動確認
console.log("[Worker] Agent Worker initialized");

// アニメーションループ関数
function animationLoop(ts: number) {
    if (!ctx || !offscreenCanvas) return;

    if (lastTs == null) lastTs = ts;
    const dt = Math.max(0, (ts - lastTs) / 1000); // 1フレームの時間（秒）
    lastTs = ts;
    _simTimeSec += dt;

    // クリア
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    // エージェントを更新・描画
    agents.forEach((agent) => {
        agent.update(
            canvasSize.width,
            canvasSize.height,
            ctx!,
            config.color,
        );
    });

    // 次のフレームをリクエスト
    rafId = requestAnimationFrame(animationLoop);
}

// アニメーション開始
function startAnimation() {
    if (rafId != null) return; // 既に実行中
    console.log("[Worker] Starting animation loop");
    lastTs = null;
    _simTimeSec = 0;
    rafId = requestAnimationFrame(animationLoop);
}

// アニメーション停止
function stopAnimation() {
    if (rafId != null) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }
    lastTs = null;
    _simTimeSec = 0;
    console.log("[Worker] Animation stopped");
}

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

            console.log("[Worker] Canvas setup complete");
            self.postMessage({ type: "initialized" });

            // アニメーション自動開始
            startAnimation();
            break;
        }

        case "start":
            console.log("[Worker] Animation start requested");
            startAnimation();
            break;

        case "stop":
            console.log("[Worker] Animation stop requested");
            stopAnimation();
            break;
    }
};

// メインスレッドにメッセージを送信（確認用）
self.postMessage({ type: "ready" });
