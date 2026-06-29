import type { EnrichmentRequestContract } from "./enrichmentRequestTypes";
import { expectedReturnSchemas } from "./expectedReturnSchemas";

export function buildPrompt(request: EnrichmentRequestContract) {
  const schemaText = expectedReturnSchemas[request.expectedReturn.schema];
  return [
    "You are helping enrich Complete Cruising, a local-first Lawrence Family cruise companion.",
    "",
    `Task: ${request.task.title}.`,
    "",
    "Use the supplied request JSON as context.",
    "Research carefully where required, but do not present uncertain information as confirmed.",
    "Separate user-entered, researched, inferred and confirmed information.",
    "Return one complete JSON object only.",
    "Do not include markdown.",
    "Do not include explanatory prose before or after the JSON.",
    "Use the exact expected return schema and wrapper below.",
    "Do not include sensitive booking information, passport data, payment data, insurance policy numbers or private identity details.",
    "Do not overwrite confirmed itinerary, sailing date, ship, cruise line, port time or all-aboard data. Where a correction may be needed, return it as a suggested correction with confidence metadata and review status.",
    "Preserve confidence, review and refresh metadata on every substantive record.",
    `Suggested filename after saving the returned JSON: ${request.task.suggestedImportFilename}`,
    "If ChatGPT returns the JSON in chat, save it as a .json file before importing if needed. Do not claim that a file attachment has been created unless the product UI actually creates one.",
    "Use British English.",
    "",
    "Request JSON:",
    JSON.stringify(request, null, 2),
    "",
    "Exact expected return JSON schema:",
    schemaText,
  ].join("\n");
}
