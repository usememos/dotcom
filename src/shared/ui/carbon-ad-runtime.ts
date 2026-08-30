const CARBON_SCRIPT_URL = "https://cdn.carbonads.com/carbon.js?serve=CWBD4K7E&placement=usememoscom&format=responsive";

interface CarbonAdsApi {
  refresh?: () => void;
}

declare global {
  interface Window {
    _carbonads?: CarbonAdsApi;
  }
}

interface CarbonAdSlot {
  mount: HTMLDivElement;
  pathname: string;
}

type ScriptStatus = "failed" | "idle" | "loading" | "ready";

/**
 * Keeps Carbon's single script connected while moving its host to the current
 * page slot. Carbon initializes the first request itself; SPA pages use refresh.
 */
class CarbonAdRuntime {
  private activeSlot: CarbonAdSlot | undefined;
  private currentPathname: string | undefined;
  private host: HTMLDivElement | undefined;
  private parkingElement: HTMLDivElement | undefined;
  private refreshPending = false;
  private script: HTMLScriptElement | undefined;
  private scriptStatus: ScriptStatus = "idle";

  navigate(pathname: string) {
    if (pathname === this.currentPathname) return;

    this.currentPathname = pathname;
    if (this.scriptStatus === "ready") {
      this.refreshPending = true;
    }
    this.reconcile();
  }

  registerParkingElement(element: HTMLDivElement) {
    this.parkingElement = element;
    this.reconcile();

    return () => {
      if (this.parkingElement === element) {
        this.parkingElement = undefined;
      }
    };
  }

  register(mount: HTMLDivElement, pathname: string) {
    this.navigate(pathname);

    const slot: CarbonAdSlot = { mount, pathname };
    this.activeSlot = slot;
    this.reconcile();

    return () => {
      if (this.activeSlot !== slot) return;

      this.activeSlot = undefined;
      this.reconcile();
    };
  }

  resetForTests() {
    if (this.script) {
      this.script.onload = null;
      this.script.onerror = null;
    }
    this.host?.remove();

    this.activeSlot = undefined;
    this.currentPathname = undefined;
    this.host = undefined;
    this.parkingElement = undefined;
    this.refreshPending = false;
    this.script = undefined;
    this.scriptStatus = "idle";

    if (typeof window !== "undefined") {
      window._carbonads = undefined;
    }
  }

  private reconcile() {
    const slot = this.activeSlot;
    const slotIsCurrent = slot !== undefined && slot.pathname === this.currentPathname && slot.mount.isConnected;

    if (!slotIsCurrent) {
      this.parkHost();
      return;
    }

    const host = this.ensureHost();
    if (host.parentElement !== slot.mount) {
      slot.mount.appendChild(host);
    }
    this.ensureRequest();
  }

  private parkHost() {
    if (!this.host) return;

    if (this.parkingElement?.isConnected) {
      this.parkingElement.appendChild(this.host);
    } else {
      this.host.remove();
    }
  }

  private ensureHost() {
    if (this.host) return this.host;

    const host = document.createElement("div");
    host.dataset.carbonAdHost = "";
    host.className = "w-full";
    this.host = host;
    return host;
  }

  private ensureRequest() {
    if (!this.activeSlot) return;

    if (this.scriptStatus === "idle") {
      this.insertScript();
    } else if (this.scriptStatus === "ready" && this.refreshPending) {
      this.refresh();
    }
  }

  private insertScript() {
    const script = document.createElement("script");
    script.src = CARBON_SCRIPT_URL;
    script.id = "_carbonads_js";
    script.async = true;
    script.onload = () => this.handleScriptLoad(script);
    script.onerror = () => this.fail(script);

    this.script = script;
    this.scriptStatus = "loading";
    this.refreshPending = false;
    this.ensureHost().appendChild(script);
  }

  private handleScriptLoad(script: HTMLScriptElement) {
    if (this.script !== script || this.scriptStatus !== "loading") return;

    if (typeof window._carbonads?.refresh !== "function") {
      this.fail(script);
      return;
    }

    // carbon.js calls init() before load, so refreshing here would duplicate it.
    this.scriptStatus = "ready";
    this.refreshPending = false;
  }

  private refresh() {
    const refresh = window._carbonads?.refresh;
    if (typeof refresh !== "function") {
      this.fail(this.script);
      return;
    }

    this.refreshPending = false;

    try {
      refresh.call(window._carbonads);
    } catch {
      this.fail(this.script);
    }
  }

  private fail(script: HTMLScriptElement | undefined) {
    if (script && this.script !== script) return;

    this.scriptStatus = "failed";
    this.refreshPending = false;
    this.host?.querySelectorAll("#carbonads, [id^='carbonads_'], #_carbonads_projs").forEach((node) => node.remove());
  }
}

export const carbonAdRuntime = new CarbonAdRuntime();

export function resetCarbonAdRuntimeForTests() {
  carbonAdRuntime.resetForTests();
}
