export interface PointerSession {
  pointerId: number;
  startClientX: number;
  startClientY: number;
}

export interface PointerSessionStore<T extends PointerSession> {
  current: T | null;
}

export type PointerInteractionMap = Record<string, PointerSession>;

export type PointerInteractionState<TModes extends PointerInteractionMap> =
  | { mode: "idle"; session: null }
  | {
      [TMode in keyof TModes]: {
        mode: TMode;
        session: TModes[TMode];
      };
    }[keyof TModes];

export interface PointerInteractionStore<TModes extends PointerInteractionMap> {
  current: PointerInteractionState<TModes>;
}

export function createPointerSession(pointerId: number, clientX: number, clientY: number): PointerSession {
  return {
    pointerId,
    startClientX: clientX,
    startClientY: clientY,
  };
}

export function isPointerSessionActive<T extends Pick<PointerSession, "pointerId">>(
  session: T | null | undefined,
  pointerId: number,
): session is T {
  return session?.pointerId === pointerId;
}

export function getPointerSessionDelta(session: PointerSession, clientX: number, clientY: number) {
  return {
    x: clientX - session.startClientX,
    y: clientY - session.startClientY,
  };
}

export function hasPointerSessionExceededThreshold(session: PointerSession, clientX: number, clientY: number, threshold: number): boolean {
  const delta = getPointerSessionDelta(session, clientX, clientY);
  return Math.hypot(delta.x, delta.y) >= threshold;
}

export function releasePointerCaptureIfHeld(element: HTMLElement, pointerId: number) {
  if (element.hasPointerCapture(pointerId)) {
    element.releasePointerCapture(pointerId);
  }
}

export function createIdlePointerInteractionState<TModes extends PointerInteractionMap>(): PointerInteractionState<TModes> {
  return {
    mode: "idle",
    session: null,
  };
}

export function isPointerInteractionMode<TModes extends PointerInteractionMap, TMode extends keyof TModes>(
  state: PointerInteractionState<TModes>,
  mode: TMode,
): state is Extract<PointerInteractionState<TModes>, { mode: TMode }> {
  return state.mode === mode;
}

export function beginPointerSession<T extends PointerSession>(store: PointerSessionStore<T>, element: HTMLElement, session: T): T {
  store.current = session;
  element.setPointerCapture(session.pointerId);
  return session;
}

export function getActivePointerSession<T extends PointerSession>(store: PointerSessionStore<T>, pointerId: number): T | null {
  return isPointerSessionActive(store.current, pointerId) ? store.current : null;
}

export function finishPointerSession<T extends PointerSession>(
  store: PointerSessionStore<T>,
  element: HTMLElement,
  pointerId: number,
): T | null {
  const session = getActivePointerSession(store, pointerId);
  if (!session) {
    return null;
  }

  releasePointerCaptureIfHeld(element, pointerId);
  store.current = null;
  return session;
}

export function cancelPointerSession<T extends PointerSession>(store: PointerSessionStore<T>, pointerId: number): T | null {
  const session = getActivePointerSession(store, pointerId);
  if (!session) {
    return null;
  }

  store.current = null;
  return session;
}

export function beginPointerInteraction<TModes extends PointerInteractionMap, TMode extends keyof TModes>(
  store: PointerInteractionStore<TModes>,
  element: HTMLElement,
  mode: TMode,
  session: TModes[TMode],
): TModes[TMode] {
  store.current = {
    mode,
    session,
  };
  element.setPointerCapture(session.pointerId);
  return session;
}

export function getActivePointerInteraction<TModes extends PointerInteractionMap, TMode extends keyof TModes>(
  store: PointerInteractionStore<TModes>,
  mode: TMode,
  pointerId: number,
): TModes[TMode] | null {
  const interaction = store.current;
  if (!isPointerInteractionMode(interaction, mode) || !isPointerSessionActive(interaction.session, pointerId)) {
    return null;
  }

  return interaction.session as TModes[TMode];
}

export function finishPointerInteraction<TModes extends PointerInteractionMap, TMode extends keyof TModes>(
  store: PointerInteractionStore<TModes>,
  element: HTMLElement,
  mode: TMode,
  pointerId: number,
): TModes[TMode] | null {
  const session = getActivePointerInteraction(store, mode, pointerId);
  if (!session) {
    return null;
  }

  releasePointerCaptureIfHeld(element, pointerId);
  store.current = createIdlePointerInteractionState<TModes>();
  return session;
}

export function cancelPointerInteraction<TModes extends PointerInteractionMap, TMode extends keyof TModes>(
  store: PointerInteractionStore<TModes>,
  mode: TMode,
  pointerId: number,
): TModes[TMode] | null {
  const session = getActivePointerInteraction(store, mode, pointerId);
  if (!session) {
    return null;
  }

  store.current = createIdlePointerInteractionState<TModes>();
  return session;
}
