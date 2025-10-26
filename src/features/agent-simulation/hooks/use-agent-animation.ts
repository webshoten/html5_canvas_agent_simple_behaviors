import type { RefObject } from "react";
import { useEffect, useRef } from "react";
import { useStore } from "../state/store";

export const useAgentAnimation = ({
    mainCanvasRef,
    offscreenRef,
}: {
    mainCanvasRef: RefObject<HTMLCanvasElement | null>;
    offscreenRef: RefObject<OffscreenCanvas | null>;
}) => {
    const workerRef = useRef<Worker | null>(null);
    const canvasSize = useStore((state) => state.canvasSize);
    const config = useStore((state) => state.config);

    // Worker初期化：canvasSizeが変わったら再起動（シンプル）
    useEffect(() => {
        const canvas = mainCanvasRef.current;

        if (!canvas || canvasSize.width === 0 || canvasSize.height === 0) {
            console.log("[Main] Canvas not ready or size is 0");
            return;
        }

        console.log("[Main] Initializing Worker...");

        // Worker作成
        const worker = new Worker(
            new URL("../workers/agent-worker.ts", import.meta.url),
            { type: "module" },
        );
        workerRef.current = worker;

        // Workerからのメッセージを受信
        worker.onmessage = (e) => {
            console.log("[Main] Received from worker:", e.data);
        };

        // Workerエラーハンドリング
        worker.onerror = (error) => {
            console.error("[Main] Worker error:", error);
        };

        // OffscreenCanvasを作成
        const offscreen = canvas.transferControlToOffscreen();
        offscreenRef.current = offscreen;

        const dpr = window.devicePixelRatio || 1;

        // OffscreenCanvasのサイズを設定
        offscreen.width = canvasSize.width * dpr;
        offscreen.height = canvasSize.height * dpr;

        console.log("[Main] Transferring OffscreenCanvas to worker...", {
            physical: { width: offscreen.width, height: offscreen.height },
            logical: canvasSize,
            dpr,
        });

        // Workerに転送して初期化
        worker.postMessage(
            {
                type: "init",
                canvas: offscreen,
                canvasSize: {
                    width: canvasSize.width,
                    height: canvasSize.height,
                },
                dpr,
                config,
            },
            [offscreen],
        );

        return () => {
            console.log("[Main] Terminating worker...");
            worker.terminate();
            workerRef.current = null;
            offscreenRef.current = null;
        };
    }, [mainCanvasRef, offscreenRef, canvasSize, config]);

    return workerRef;
};
