const CARBON_SCRIPT_URL = "https://cdn.carbonads.com/carbon.js?serve=CWBD4K7E&placement=usememoscom&format=cover";

export type CarbonAdRenderStatus = "error" | "inactive" | "loaded" | "loading";

interface CarbonAdsApi {
  refresh?: () => void;
}

declare global {
  interface Window {
    _carbonads?: CarbonAdsApi;
  }
}

interface CarbonAdRegistration {
  id: symbol;
  mount: HTMLDivElement;
  pathname: string;
  setStatus: (status: CarbonAdRenderStatus) => void;
}

type ScriptStatus = "failed" | "idle" | "loading" | "ready";

class CarbonAdRuntime {
  private activeRegistration: CarbonAdRegistration | undefined;
  private currentPathname: string | undefined;
  private host: HTMLDivElement | undefined;
  private navigationRevision = 0;
  private observer: MutationObserver | undefined;
  private parkingElement: HTMLDivElement | undefined;
  private registrations: CarbonAdRegistration[] = [];
  private script: HTMLScriptElement | undefined;
  private scriptStatus: ScriptStatus = "idle";
  private servedRevision: number | undefined;

  navigate(pathname: string) {
    if (pathname === this.currentPathname) return;

    this.currentPathname = pathname;
    this.navigationRevision += 1;
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

  register(mount: HTMLDivElement, pathname: string, setStatus: CarbonAdRegistration["setStatus"]) {
    this.navigate(pathname);

    const registration: CarbonAdRegistration = {
      id: Symbol("carbon-ad-slot"),
      mount,
      pathname,
      setStatus,
    };

    this.registrations.push(registration);
    this.reconcile();

    return () => {
      this.registrations = this.registrations.filter((candidate) => candidate.id !== registration.id);
      if (this.activeRegistration?.id === registration.id) {
        this.activeRegistration = undefined;
      }
      this.reconcile();
    };
  }

  resetForTests() {
    this.observer?.disconnect();
    if (this.script) {
      this.script.onload = null;
      this.script.onerror = null;
    }
    this.host?.remove();

    this.activeRegistration = undefined;
    this.currentPathname = undefined;
    this.host = undefined;
    this.navigationRevision = 0;
    this.observer = undefined;
    this.parkingElement = undefined;
    this.registrations = [];
    this.script = undefined;
    this.scriptStatus = "idle";
    this.servedRevision = undefined;

    if (typeof window !== "undefined") {
      delete window._carbonads;
    }
  }

  private reconcile() {
    const nextRegistration = [...this.registrations]
      .reverse()
      .find((registration) => registration.pathname === this.currentPathname && registration.mount.isConnected);

    if (this.activeRegistration?.id !== nextRegistration?.id) {
      this.activeRegistration?.setStatus("inactive");
      this.activeRegistration = nextRegistration;
    }

    if (!nextRegistration) {
      if (this.host) {
        if (this.parkingElement?.isConnected) {
          this.parkingElement.appendChild(this.host);
        } else {
          this.host.remove();
        }
      }
      return;
    }

    const host = this.ensureHost();
    if (host.parentElement !== nextRegistration.mount) {
      nextRegistration.mount.appendChild(host);
    }

    this.ensureRequestForCurrentNavigation();
    this.syncRenderStatus();
  }

  private ensureHost() {
    if (this.host) return this.host;

    const host = document.createElement("div");
    host.dataset.carbonAdHost = "";
    host.className = "w-full";

    this.observer = new MutationObserver(() => this.syncRenderStatus());
    this.observer.observe(host, { childList: true, subtree: true });
    this.host = host;

    return host;
  }

  private ensureRequestForCurrentNavigation() {
    if (!this.activeRegistration) return;

    if (this.scriptStatus === "failed") {
      this.activeRegistration.setStatus("error");
      return;
    }

    if (this.scriptStatus === "idle") {
      this.insertScript();
      return;
    }

    if (this.scriptStatus === "loading") {
      this.activeRegistration.setStatus("loading");
      return;
    }

    if (this.servedRevision !== this.navigationRevision) {
      this.refresh();
    }
  }

  private insertScript() {
    const host = this.ensureHost();
    const script = document.createElement("script");
    script.src = CARBON_SCRIPT_URL;
    script.id = "_carbonads_js";
    script.async = true;
    script.onload = () => this.handleScriptLoad(script);
    script.onerror = () => this.fail(script);

    this.script = script;
    this.scriptStatus = "loading";
    this.servedRevision = this.navigationRevision;
    this.activeRegistration?.setStatus("loading");
    host.appendChild(script);
  }

  private handleScriptLoad(script: HTMLScriptElement) {
    if (this.script !== script || this.scriptStatus !== "loading") return;

    if (typeof window._carbonads?.refresh !== "function") {
      this.fail(script);
      return;
    }

    // carbon.js calls init() itself before the load event. Mark the request as
    // belonging to the current navigation, but never refresh again on load.
    this.scriptStatus = "ready";
    this.servedRevision = this.navigationRevision;
    this.syncRenderStatus();
  }

  private refresh() {
    if (!this.activeRegistration || this.scriptStatus !== "ready") return;

    const refresh = window._carbonads?.refresh;
    if (typeof refresh !== "function") {
      this.fail(this.script);
      return;
    }

    this.servedRevision = this.navigationRevision;
    this.activeRegistration.setStatus("loading");

    try {
      refresh.call(window._carbonads);
    } catch {
      this.fail(this.script);
    }
  }

  private fail(script: HTMLScriptElement | undefined) {
    if (script && this.script !== script) return;

    this.scriptStatus = "failed";
    this.activeRegistration?.setStatus("error");
  }

  private syncRenderStatus() {
    if (!this.activeRegistration) return;

    if (this.scriptStatus === "failed") {
      this.activeRegistration.setStatus("error");
      return;
    }

    const creative = this.host?.querySelector("#carbonads, [id^='carbonads_']");
    this.activeRegistration.setStatus(creative ? "loaded" : "loading");
  }
}

export const carbonAdRuntime = new CarbonAdRuntime();

export function resetCarbonAdRuntimeForTests() {
  carbonAdRuntime.resetForTests();
}
