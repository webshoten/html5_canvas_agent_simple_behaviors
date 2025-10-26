import { create } from "zustand";
import type { Agent } from "@/features/sir-simulation/logic/agent";
import { createPopulation } from "../logic/create-population";

export type HistoryPoint = { t: number; s: number; i: number; r: number };

export type ConfigType = {
    populationN: number;
    agentRadius: number;
    color: string;
    velocity: { minSpeed: number; maxSpeed: number };
};

type StoreState = {
    lastTs: number | null;
    simTimeSec: number;
    config: ConfigType;
    agents: Agent[];
    reset: ({ width, height }: { width: number; height: number }) => void;
    setConfig: (partial: Partial<StoreState["config"]>) => void;
    /** シミュレーション時間（秒）を更新 */
    setSimTimeSec: (t: number) => void;
    setAgents: (list: Agent[]) => void;
};

export const useSimStore = create<StoreState>((set, get) => ({
    lastTs: null,
    simTimeSec: 0,
    config: {
        populationN: 100,
        agentRadius: 10,
        color: "hsl(210 80% 60%)",
        velocity: { minSpeed: 0.5, maxSpeed: 2.0 },
    },
    agents: [],
    reset: ({ width, height }: { width: number; height: number }) => {
        const { config } = get();
        const updatedConfig = { ...config };

        set({
            lastTs: null,
            simTimeSec: 0,
            agents: [],
            config: updatedConfig,
        });
        set({
            agents: createPopulation({
                width,
                height,
                config: updatedConfig,
            }),
        });
    },
    setConfig: (partial) =>
        set((s) => {
            const next = { ...s.config, ...partial };
            return { config: next };
        }),
    setSimTimeSec: (t) => set({ simTimeSec: t }),
    setAgents: (list) => set({ agents: list }),
}));
