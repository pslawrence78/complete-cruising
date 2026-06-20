import type { z } from "zod";
import type { ShorePlanSchema } from "../schemas";

export type ShorePlanRecord = z.infer<typeof ShorePlanSchema>;
