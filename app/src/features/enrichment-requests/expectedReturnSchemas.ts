export const sharedMetadataSchemaText = `{
  "confidence": "confirmed | high | medium | low | inferred | unknown",
  "reviewStatus": "not_reviewed | needs_user_review | reviewed | verified | needs_refresh | stale | rejected",
  "sourceType": "booking_confirmed | cruise_line_confirmed | official_port_source | official_tourism_source | official_attraction_source | official_transport_source | reputable_travel_source | family_note | user_entered | researched | inferred",
  "sourceSummary": "Short summary of source basis or caveat.",
  "lastReviewedAt": null,
  "refreshRecommended": true,
  "refreshReason": "Why this content should or should not be refreshed.",
  "validFrom": null,
  "validUntil": null
}`;

export const expectedReturnSchemas: Record<string, string> = {
  "complete-cruising-sailing-shell-enrichment-v1": `{
  "schema": "complete-cruising-sailing-shell-enrichment-v1",
  "schemaVersion": 1,
  "sourceApp": "ChatGPT",
  "generatedAt": "ISO-8601 datetime",
  "target": { "sailingId": "string or null", "sailingName": "string", "shipName": "string or null", "cruiseLineName": "string or null" },
  "provenance": { "userEnteredFieldsUsed": ["string"], "researchedFields": ["string"], "inferredFields": ["string"], "confirmedFields": ["string"], "sourcesConsulted": [{ "title": "string", "url": "string or null", "sourceType": "string", "notes": "string" }] },
  "enrichmentRun": { "id": "string", "name": "string", "targetType": "sailing", "targetName": "string", "enrichmentPackType": "sailing_shell_enrichment", "status": "generated", "sourceTypesUsed": ["string"], "validationWarnings": ["string"], "notes": "string" },
  "sailingEnrichment": { "planningSummary": "string", "routeContext": "string", "cruiseLineContext": "string", "shipContextSummary": "string", "readinessPrompts": ["string"], "knownUnknowns": ["string"], "verificationNeeded": ["string"], "suggestedNextEnrichment": ["string"], "familyRelevance": ["string"], "watchouts": ["string"] },
  "sections": [{ "id": "string", "parentType": "sailing", "parentId": "string or null", "sectionType": "sailing_planning_summary", "title": "string", "shortSummary": "string", "structuredFacts": [{ "label": "string", "value": "string", "origin": "user_entered | researched | inferred | confirmed", "metadata": {} }], "practicalGuidance": ["string"], "familyRelevance": ["string"], "watchouts": ["string"], "suggestedNextActions": ["string"], "confidence": ${sharedMetadataSchemaText} }],
  "importAdvice": { "safeToImport": true, "requiresUserReview": true, "protectedFieldWarnings": ["string"], "recommendedImportType": "sailing_shell" }
}`,
  "complete-cruising-itinerary-verification-v1": `{
  "schema": "complete-cruising-itinerary-verification-v1",
  "schemaVersion": 1,
  "sourceApp": "ChatGPT",
  "generatedAt": "ISO-8601 datetime",
  "target": { "sailingId": "string or null", "sailingName": "string" },
  "provenance": { "userEnteredFieldsUsed": ["string"], "researchedFields": ["string"], "inferredFields": ["string"], "confirmedFields": ["string"], "sourcesConsulted": [{ "title": "string", "url": "string or null", "sourceType": "string", "notes": "string" }] },
  "verificationSummary": { "overallStatus": "likely_valid | needs_review | inconsistent | insufficient_information", "summary": "string", "majorWarnings": ["string"], "minorWarnings": ["string"], "missingInformation": ["string"] },
  "dayFindings": [{ "dayNumber": 1, "date": "YYYY-MM-DD", "currentDayType": "string", "currentPortName": "string or null", "status": "appears_valid | needs_review | likely_incorrect | insufficient_information", "findings": ["string"], "suggestedCorrections": [{ "field": "string", "currentValue": "string or null", "suggestedValue": "string or null", "reason": "string", "origin": "researched | inferred", "confidence": ${sharedMetadataSchemaText} }], "refreshRecommended": true, "refreshReason": "string" }],
  "proposedImport": { "updatesProtectedFields": true, "protectedFieldWarnings": ["string"], "recommendedAction": "review_only | import_non_protected | import_after_confirmation", "notes": "string" }
}`,
  "complete-cruising-ship-pack-enrichment-v1": `{
  "schema": "complete-cruising-ship-pack-enrichment-v1",
  "schemaVersion": 1,
  "sourceApp": "ChatGPT",
  "generatedAt": "ISO-8601 datetime",
  "target": { "shipId": "string or null", "shipName": "string", "cruiseLineName": "string or null", "sailingId": "string or null" },
  "pack": { "packType": "ship_identity_character | ship_layout_orientation | ship_dining | ship_cabins_practical_life | ship_family_seb_suitability | ship_entertainment_venues | ship_pools_recreation_relaxation | ship_tips_watchouts_best_experiences", "title": "string", "scope": ["string"], "exclusions": ["string"] },
  "provenance": { "userEnteredFieldsUsed": ["string"], "researchedFields": ["string"], "inferredFields": ["string"], "confirmedFields": ["string"], "sourcesConsulted": [{ "title": "string", "url": "string or null", "sourceType": "string", "notes": "string" }] },
  "enrichmentRun": { "id": "string", "name": "string", "targetType": "ship", "targetName": "string", "enrichmentPackType": "string", "status": "generated", "sourceTypesUsed": ["string"], "validationWarnings": ["string"], "notes": "string" },
  "section": { "id": "string", "parentType": "ship", "parentId": "string or null", "sectionType": "string", "title": "string", "shortSummary": "string", "structuredFacts": [{ "label": "string", "value": "string", "origin": "user_entered | researched | inferred | confirmed", "metadata": {} }], "practicalGuidance": ["string"], "familyRelevance": ["string"], "watchouts": ["string"], "suggestedNextActions": ["string"], "sebDiscovery": null, "photoPrompts": ["string"], "confidence": ${sharedMetadataSchemaText} },
  "shipPatchProposal": { "safeNonProtectedUpdates": {}, "protectedUpdates": {}, "protectedFieldWarnings": ["string"], "notes": "string" },
  "importAdvice": { "safeToImport": true, "requiresUserReview": true, "recommendedImportType": "ship_enrichment" }
}`,
  "complete-cruising-port-pack-enrichment-v1": `{
  "schema": "complete-cruising-port-pack-enrichment-v1",
  "schemaVersion": 1,
  "sourceApp": "ChatGPT",
  "generatedAt": "ISO-8601 datetime",
  "target": { "portId": "string or null", "portName": "string", "countryName": "string or null", "sailingId": "string or null", "itineraryDayId": "string or null" },
  "pack": { "packType": "port_fact_file | port_cruise_logistics | port_getting_around | port_top_10_highlights | port_family_lens | port_food_culture_local_experience | port_photography_views | port_hints_tips_watchouts | port_weather_seasonality | port_suggested_shore_plans", "title": "string", "scope": ["string"], "exclusions": ["string"] },
  "provenance": { "userEnteredFieldsUsed": ["string"], "researchedFields": ["string"], "inferredFields": ["string"], "confirmedFields": ["string"], "sourcesConsulted": [{ "title": "string", "url": "string or null", "sourceType": "string", "notes": "string" }] },
  "enrichmentRun": { "id": "string", "name": "string", "targetType": "port", "targetName": "string", "enrichmentPackType": "string", "status": "generated", "sourceTypesUsed": ["string"], "validationWarnings": ["string"], "notes": "string" },
  "section": { "id": "string", "parentType": "port", "parentId": "string or null", "sectionType": "string", "title": "string", "shortSummary": "string", "structuredFacts": [{ "label": "string", "value": "string", "origin": "user_entered | researched | inferred | confirmed", "metadata": {} }], "practicalGuidance": ["string"], "familyRelevance": ["string"], "watchouts": ["string"], "suggestedNextActions": ["string"], "sebDiscovery": { "flag": "string or null", "localPhrase": "string or null", "pronunciationHint": "string or null", "geographyFact": "string or null", "thingToSpot": "string or null", "quizQuestion": "string or null", "quizAnswer": "string or null" }, "photoPrompts": ["string"], "weatherSensitivity": "string or null", "accessibilityNotes": "string or null", "bookingAdvice": "string or null", "costNotes": "string or null", "timingAdvice": "string or null", "returnBufferAdvice": "string or null", "confidence": ${sharedMetadataSchemaText} },
  "attractionProposals": [{ "name": "string", "type": "string", "shortDescription": "string", "whyItMatters": "string", "distanceFromPortText": "string or null", "travelTimeFromPortText": "string or null", "typicalVisitDuration": "string or null", "bookingRequired": "required | recommended | optional | not_required | unknown", "costLevel": "free | low | medium | high | unknown", "familySuitability": "excellent | good | mixed | poor | unknown", "sebInterestScore": 1, "parentInterestScore": 1, "weatherSensitivity": "low | medium | high | indoor | unknown", "accessibilityNotes": "string", "photoPrompt": "string", "confidence": ${sharedMetadataSchemaText} }],
  "portPatchProposal": { "safeNonProtectedUpdates": {}, "protectedUpdates": {}, "protectedFieldWarnings": ["string"], "notes": "string" },
  "importAdvice": { "safeToImport": true, "requiresUserReview": true, "recommendedImportType": "port_enrichment" }
}`,
  "complete-cruising-shore-plan-generation-v1": `{
  "schema": "complete-cruising-shore-plan-generation-v1",
  "schemaVersion": 1,
  "sourceApp": "ChatGPT",
  "generatedAt": "ISO-8601 datetime",
  "target": { "sailingId": "string or null", "sailingName": "string", "itineraryDayId": "string or null", "dayNumber": 1, "date": "YYYY-MM-DD", "portId": "string or null", "portName": "string" },
  "provenance": { "userEnteredFieldsUsed": ["string"], "researchedFields": ["string"], "inferredFields": ["string"], "confirmedFields": ["string"], "sourcesConsulted": [{ "title": "string", "url": "string or null", "sourceType": "string", "notes": "string" }] },
  "planningAssumptions": [{ "assumption": "string", "origin": "user_entered | researched | inferred | confirmed", "confidence": ${sharedMetadataSchemaText} }],
  "shorePlans": [{ "id": "string", "itineraryDayId": "string or null", "portId": "string or null", "name": "string", "planType": "booked_excursion | diy | private_tour | low_effort | backup | onboard_only | ambitious", "status": "idea | shortlisted | selected | booked | completed | cancelled | rejected", "summary": "string", "startTime": "HH:MM or null", "endTime": "HH:MM or null", "latestSafeReturnTime": "HH:MM or null", "transportMode": "walk | taxi | shuttle | public_transport | private_transfer | cruise_excursion | mixed | unknown", "attractionNames": ["string"], "estimatedTravelTimeText": "string", "returnBufferMinutes": 0, "riskLevel": "low | medium | high | unknown", "weatherDependency": "low | medium | high | unknown", "familySuitability": "excellent | good | mixed | poor | unknown", "sebSuitabilityNotes": "string", "costNotes": "string", "bookingReference": null, "whatToTake": ["string"], "watchouts": ["string"], "confidence": ${sharedMetadataSchemaText} }],
  "recommendation": { "recommendedPlanId": "string", "reason": "string", "backupPlanId": "string or null", "returnToShipAdvice": "string" },
  "importAdvice": { "safeToImport": true, "requiresUserReview": true, "protectedFieldWarnings": ["string"], "recommendedImportType": "shore_plan" }
}`,
  "complete-cruising-day-guide-generation-v1": `{
  "schema": "complete-cruising-day-guide-generation-v1",
  "schemaVersion": 1,
  "sourceApp": "ChatGPT",
  "generatedAt": "ISO-8601 datetime",
  "target": { "sailingId": "string or null", "sailingName": "string", "itineraryDayId": "string or null", "dayNumber": 1, "date": "YYYY-MM-DD", "dayType": "embarkation | port | sea | scenic_cruising | overnight_port | disembarkation", "portName": "string or null" },
  "provenance": { "userEnteredFieldsUsed": ["string"], "researchedFields": ["string"], "inferredFields": ["string"], "confirmedFields": ["string"], "sourcesConsulted": [{ "title": "string", "url": "string or null", "sourceType": "string", "notes": "string" }] },
  "dayGuide": { "id": "string", "itineraryDayId": "string or null", "title": "string", "todayAtAGlance": { "location": "string", "arrivalTime": "HH:MM or null", "departureTime": "HH:MM or null", "allAboardTime": "HH:MM or null", "latestSafeReturnTime": "HH:MM or null", "weatherSummary": "string or null", "localLanguage": "string or null", "localCurrency": "string or null" }, "whatMattersToday": ["string"], "likelyPlanSummary": "string", "backupPlanSummary": "string", "takeAshore": ["string"], "sebDiscovery": { "flag": "string or null", "localPhrase": "string or null", "pronunciationHint": "string or null", "geographyFact": "string or null", "thingToSpot": "string or null", "quizQuestion": "string or null", "quizAnswer": "string or null" }, "photoPrompt": "string", "returnBufferAdvice": "string", "confidenceNotes": ["string"], "generatedFrom": ["string"], "confidence": ${sharedMetadataSchemaText} },
  "operationalWarnings": ["string"],
  "memoryPrompt": { "prompt": "string", "sebFavouritePrompt": "string", "photoPrompt": "string", "adventureAlmanacHint": "string" },
  "importAdvice": { "safeToImport": true, "requiresUserReview": true, "protectedFieldWarnings": ["string"], "recommendedImportType": "day_guide" }
}`,
};
