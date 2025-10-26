import type { Vector2 } from "../types/agent-types";

export class Agent {
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
        c: CanvasRenderingContext2D,
        color: string,
    ): void {
        // エージェント本体を描画
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = color;
        c.fill();
    }

    update(
        canvas: HTMLCanvasElement,
        c: CanvasRenderingContext2D,
        color: string,
    ) {
        // 位置を更新
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // 周期境界条件（半径込み）
        if (this.x < -this.radius) this.x = canvas.width + this.radius; //左端
        if (this.x > canvas.width + this.radius) this.x = -this.radius; //右端
        if (this.y < -this.radius) this.y = canvas.height + this.radius; //上端
        if (this.y > canvas.height + this.radius) this.y = -this.radius; //下端

        // 描画
        this.draw(c, color);
    }
}
