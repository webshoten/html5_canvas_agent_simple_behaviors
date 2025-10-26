import type { ConfigType } from "../state/store";
import type { Vector2 } from "../types/agent-types";
import { Agent } from "./agent";

function randomBetween(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

function randomVelocity(minSpeed: number, maxSpeed: number): Vector2 {
    const angle = Math.random() * Math.PI * 2;
    const speed = randomBetween(minSpeed, maxSpeed);
    return { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };
}

// 個体群を再生成
export function createPopulation(
    {
        width,
        height,
        config,
    }: {
        width: number;
        height: number;
        config: ConfigType;
    },
): Agent[] {
    const arr = Array.from({ length: config.populationN }, (_, _i) => {
        const radius = config.agentRadius;
        const color = config.color;
        const x = randomBetween(radius, width - radius);
        const y = randomBetween(radius, height - radius);
        const velocity = randomVelocity(
            config.velocity.minSpeed,
            config.velocity.maxSpeed,
        );
        const agent = new Agent(x, y, radius, color, velocity);
        return agent;
    });
    return arr;
}
