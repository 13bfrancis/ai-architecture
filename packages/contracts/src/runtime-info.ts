import { z } from "zod";

export const runtimeInfoChannel = "runtime:get-info" as const;

export const runtimeInfoRequestSchema = z.object({}).strict();

export const runtimeInfoResponseSchema = z
  .object({
    appName: z.string().trim().min(1).max(100),
    appVersion: z
      .string()
      .trim()
      .regex(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/),
    platform: z.literal("darwin"),
  })
  .strict();

export type RuntimeInfoRequest = z.infer<typeof runtimeInfoRequestSchema>;
export type RuntimeInfo = z.infer<typeof runtimeInfoResponseSchema>;
