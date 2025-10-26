"use client";

import type { RefObject } from "react";
import { useEffect } from "react";
import { useStore } from "../state/store";

/**
 * Canvasを高解像度ディスプレイ（Retina等）に対応させるhooks
 * 画面サイズの取得とDPR対応を行い、storeに保存する
 * @param canvasRef - Canvas要素のRef
 * @param ctxRef - CanvasRenderingContext2Dのref
 */
export const useCanvasDpr = ({
    canvasRef,
    ctxRef,
}: {
    canvasRef: RefObject<HTMLCanvasElement | null>;
    ctxRef: RefObject<CanvasRenderingContext2D | null>;
}) => {
    const setCanvasSize = useStore((state) => state.setCanvasSize);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx) return;

        const setupCanvas = () => {
            // 画面サイズ取得（クライアントサイドのみ）
            const w = window.innerWidth;
            const h = window.innerHeight;
            const dpr = window.devicePixelRatio || 1;

            // 物理ピクセルサイズを設定（高解像度対応）
            canvas.width = w * dpr;
            canvas.height = h * dpr;

            // CSSサイズは論理サイズのまま
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;

            // コンテキストをDPRでスケール（描画座標は論理サイズで扱える）
            ctx.scale(dpr, dpr);

            // 論理サイズをstoreに保存
            setCanvasSize({ width: w, height: h });
        };

        // 初回セットアップ
        setupCanvas();

        // リサイズイベントリスナー
        const handleResize = () => {
            setupCanvas();
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [canvasRef, ctxRef, setCanvasSize]);
};
