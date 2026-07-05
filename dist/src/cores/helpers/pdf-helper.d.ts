import type { Response } from 'express';
export type TaskReportRow = {
    assignee: string;
    todo: string;
    status: string;
    created: number;
    completed: number;
    project: string;
    timeSpendMinutes: number;
    createdAt: string;
    groupMonth: string;
    groupWeek: number;
    groupDay: string;
};
export type TaskReportPdfData = {
    month: number | null;
    year: number;
    monthName: string | null;
    periodLabel: string;
    filterSummary: {
        month: string;
        year: string;
        project: string;
        user: string;
        type: string;
    };
    totalTimeSpendMinutes: number;
    totalTodos: number;
    totalProjects: number;
    totalCompleted: number;
    performanceTitle: string;
    performanceSubtitle: string;
    performanceScore: number;
    groupByMonth: boolean;
    rows: TaskReportRow[];
};
export declare function normalizeReportMonth(month?: string, year?: string): {
    month: number;
    year: number;
    monthName: string;
    periodLabel: string;
    startDate: Date;
    endDate: Date;
};
export declare function normalizeReportPeriod(month?: string, year?: string): {
    month: number;
    year: number;
    monthName: string;
    periodLabel: string;
    startDate: Date;
    endDate: Date;
} | {
    month: null;
    year: number;
    monthName: null;
    periodLabel: string;
    startDate: Date;
    endDate: Date;
};
export declare function calculateTaskReportPerformance(data: {
    totalTimeSpendMinutes: number;
    totalTodos: number;
    totalProjects: number;
    totalCompleted: number;
}): {
    title: string;
    subtitle: string;
    score: number;
};
export declare function formatReportDuration(totalMinutes: number): string;
export declare function taskGeneratehtml(data: TaskReportPdfData): string;
export declare function generatePdf(res: Response, data: TaskReportPdfData, filename?: string): Promise<void>;
