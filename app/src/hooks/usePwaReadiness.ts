import { useEffect, useState } from "react";
import { getDashboardBundle } from "../db/repositories";
import { useLocalQuery } from "./useLocalData";

function getBrowserOnlineStatus() {
  return typeof navigator === "undefined" ? true : navigator.onLine;
}

export function usePwaReadiness() {
  const localData = useLocalQuery(getDashboardBundle, []);
  const [online, setOnline] = useState(getBrowserOnlineStatus);
  const [serviceWorkerReady, setServiceWorkerReady] = useState(false);
  const serviceWorkerSupported =
    typeof navigator !== "undefined" && "serviceWorker" in navigator;

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!serviceWorkerSupported) return;

    navigator.serviceWorker.ready
      .then(() => setServiceWorkerReady(true))
      .catch(() => setServiceWorkerReady(false));
  }, [serviceWorkerSupported]);

  return {
    online,
    serviceWorkerReady,
    serviceWorkerSupported,
    lastLocalUpdate: localData.data?.sailing.audit.updatedAt,
  };
}
