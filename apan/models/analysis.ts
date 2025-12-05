// src/models/analysis.ts

export interface AnalysisResult {
    fps: number;
    frame_count: number;
    scale_m_per_px: number;
    step_count_total: number;
    speed: {
        velocity_max_m_s: number;
        velocity_mean_m_s: number;
        distance_m: number;
        speed_series_m_s: number[];
    };
    jump: {
        has_jump: boolean;
        jump_height_m: number | null;
        jump_duration_s: number;
        jump_distance_m: number;
    };
    stride: {
        stride_count: number;
        stride_length_mean_m: number | null;
        stride_cadence_hz: number | null;
    };
    series: {
        speed_m_s: number[];      // Velocidade corrida
        jump_speed_m_s: number[]; // Velocidade salto
        step_count: number[];
    };
}