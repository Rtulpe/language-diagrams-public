export function createElement(tagName: string, cssClasses?: string[]): HTMLElement {
  const element = document.createElement(tagName)
  if (cssClasses !== undefined) {
    element.classList.add(...cssClasses)
  }
  return element
}

/**
 * Helper for logging errors that occur while dispatching actions.
 */
export function logActionError(error: unknown, actionKind: unknown): void {
  console.error("Error while dispatching action: ", actionKind, error)
}

export function copyTextToClipboard(text: string): void {
  void navigator.clipboard.writeText(text)
}
