import type { z } from "zod";
import type { AttractionSchema, DayGuideSchema, EnrichmentRunSchema, EnrichmentSectionSchema, PortSchema, ShipSchema } from "../schemas";

export type Ship = z.infer<typeof ShipSchema>;
export type Port = z.infer<typeof PortSchema>;
export type Attraction = z.infer<typeof AttractionSchema>;
export type DayGuide = z.infer<typeof DayGuideSchema>;
export type EnrichmentRun = z.infer<typeof EnrichmentRunSchema>;
export type EnrichmentSection = z.infer<typeof EnrichmentSectionSchema>;
