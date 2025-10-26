"use client";

import type { RefObject } from "react";
import { useEffect } from "react";
import { useStore } from "../state/store";

/**
 * HTMLCanvasのCSSサイズを管理するhooks
 * OffscreenCanvas対応版：OffscreenCanvasには触らず、表示用のHTMLCanvasのみ管理
 * @param canvasRef - HTMLCanvas要素のRef（CSSスタイル設定用）
 */
export const useCanvasDpr = ({
    canvasRef,
}: {
    canvasRef: RefObject<HTMLCanvasElement | null>;
}) => {
    const setCanvasSize = useStore((state) => state.setCanvasSize);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const setupCanvas = () => {
            // 画面サイズ取得（クライアントサイドのみ）
            const w = window.innerWidth;
            const h = window.innerHeight;

            // HTMLCanvasElementのCSSサイズを設定（表示用）
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;

            // 論理サイズをstoreに保存
            setCanvasSize({ width: w, height: h });

            console.log("[useCanvasDpr] Canvas size updated", {
                logical: { w, h },
            });
        };

        // 初回セットアップ
        setupCanvas();

        // リサイズイベントリスナー
        const handleResize = () => {
            setupCanvas();
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [canvasRef, setCanvasSize]);
};
