export function findScratchpadItemId(target: EventTarget | null, boundary: HTMLElement | null): string | undefined {
  let element = target as HTMLElement | null;

  while (element && element !== boundary) {
    const itemId = element.dataset.scratchpadItemId;
    if (itemId) {
      return itemId;
    }
    element = element.parentElement;
  }

  return undefined;
}

export function isWithinScratchpadItem(target: EventTarget | null, boundary: HTMLElement | null): boolean {
  let element = target as HTMLElement | null;

  while (element && element !== boundary) {
    if (element.dataset.scratchpadItem === "true") {
      return true;
    }
    element = element.parentElement;
  }

  return false;
}

export function isWithinScratchpadUi(target: EventTarget | null, boundary: HTMLElement | null): boolean {
  let element = target as HTMLElement | null;

  while (element && element !== boundary) {
    if (element.dataset.scratchpadUi === "true") {
      return true;
    }
    element = element.parentElement;
  }

  return false;
}
