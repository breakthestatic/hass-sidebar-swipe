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

export function lockBody() {
  Object.assign(document.body.style, {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: `${document.documentElement.scrollTop}px`,
  })
}

export function unlockBody() {
  const top = parseInt(document.body.style.bottom)

  Object.assign(document.body.style, {
    position: '',
    left: '',
    right: '',
    bottom: '',
  })

  window.scrollTo({top, left: 0, behavior: 'auto'})
}
