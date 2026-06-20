import { db, type CompleteCruisingDb } from "./completeCruisingDb";
import { seedSampleData } from "./seedDatabase";

export async function clearSampleData(database: CompleteCruisingDb = db): Promise<void> {
  await database.transaction("rw", database.tables, async () => {
    await Promise.all(database.tables.map((table) => table.clear()));
  });
}

export async function resetSampleData(database: CompleteCruisingDb = db): Promise<void> {
  await clearSampleData(database);
  await seedSampleData(database);
}

