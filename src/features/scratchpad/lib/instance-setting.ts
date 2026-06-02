import type { MemoInstance } from "@/features/scratchpad/types";

interface InstanceSettingInput {
  id?: string;
  name?: string;
  baseUrl?: string;
  url?: string;
  accessToken: string;
  connectionStatus?: MemoInstance["connectionStatus"];
  status?: MemoInstance["connectionStatus"];
  isDefault?: boolean;
  lastConnectedAt?: Date | string | null;
  lastConnected?: Date | string | null;
  serverProfile?: MemoInstance["serverProfile"];
}

function normalizeBaseUrl(url: string): string {
  return url.trim().replace(/\/+$/, "");
}

function normalizeDate(value: Date | string | null | undefined): Date | null {
  if (!value) return null;
  return value instanceof Date ? value : new Date(value);
}

export function normalizeInstanceSettingInput(input: InstanceSettingInput): MemoInstance {
  return {
    id: input.id || `instance-${Date.now()}`,
    name: input.name?.trim() || "My Memos Instance",
    baseUrl: normalizeBaseUrl(input.baseUrl ?? input.url ?? ""),
    accessToken: input.accessToken,
    connectionStatus: input.connectionStatus ?? input.status ?? "untested",
    lastConnectedAt: normalizeDate(input.lastConnectedAt ?? input.lastConnected),
    serverProfile: input.serverProfile,
  };
}

export function migrateLegacyInstanceSetting(instances: InstanceSettingInput[]): MemoInstance | null {
  const legacyInstance = instances.find((instance) => "isDefault" in instance && instance.isDefault) ?? instances[0];
  return legacyInstance ? normalizeInstanceSettingInput(legacyInstance) : null;
}
