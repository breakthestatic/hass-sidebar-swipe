// Adapted from https://www.abeautifulsite.net/posts/querying-through-shadow-roots/
export function shadowQuery(
  selector: string,
  rootNode: Document | Element = document
): Element | null {
  const selectors = String(selector).split('>>>')
  let currentNode = rootNode

  selectors.find((_, index) => {
    if (index === 0) {
      currentNode = rootNode.querySelector(selectors[index]) as Element
    } else if (currentNode instanceof Element) {
      currentNode = currentNode?.shadowRoot?.querySelector(selectors[index]) as Element
    }

    return currentNode === null
  })

  if (currentNode === rootNode) {
    return null
  }

  return currentNode as Element | null
}
