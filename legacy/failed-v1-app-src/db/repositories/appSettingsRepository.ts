import type { AppSetting } from "../../types";
import { AppSettingSchema } from "../../schemas";
import { db, type CompleteCruisingDb } from "../completeCruisingDb";
import { ACTIVE_SAILING_SETTING, SELECTED_TODAY_DAY_SETTING } from "../seedDatabase";

export async function getAppSetting(key: string, database: CompleteCruisingDb = db): Promise<AppSetting | undefined> {
  return database.appSettings.where("key").equals(key).first();
}

export async function setAppSetting(key: string, value: unknown, database: CompleteCruisingDb = db): Promise<void> {
  const current = await getAppSetting(key, database);
  const now = new Date().toISOString();
  const setting = AppSettingSchema.parse({
    id: current?.id ?? `setting-${key}`,
    key,
    value,
    audit: current?.audit
      ? { ...current.audit, updatedAt: now, updatedBy: "local-user" }
      : { createdAt: now, updatedAt: now, createdBy: "local-user", updatedBy: "local-user" },
  });
  await database.appSettings.put(setting);
}

export async function getActiveSailingId(database: CompleteCruisingDb = db): Promise<string | undefined> {
  const value = (await getAppSetting(ACTIVE_SAILING_SETTING, database))?.value;
  return typeof value === "string" ? value : undefined;
}

export const setActiveSailingId = (id: string, database: CompleteCruisingDb = db) => setAppSetting(ACTIVE_SAILING_SETTING, id, database);
export const getSelectedTodayDayId = async (database: CompleteCruisingDb = db) => {
  const value = (await getAppSetting(SELECTED_TODAY_DAY_SETTING, database))?.value;
  return typeof value === "string" ? value : undefined;
};
export const setSelectedTodayDayId = (id: string, database: CompleteCruisingDb = db) => setAppSetting(SELECTED_TODAY_DAY_SETTING, id, database);

