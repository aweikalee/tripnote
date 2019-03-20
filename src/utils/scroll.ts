export function scrollTo(
    elt: Element | HTMLElement,
    parent: HTMLElement | Window = window,
    offset: number = 0
) {
    setScrollTop(parent, getScrollTop(elt) + offset)
}

export function setScrollTop(element: HTMLElement | Window, value: number) {
    'scrollTop' in element
        ? (element.scrollTop = value)
        : element.scrollTo(element.scrollX, value)
}

export function getScrollTop(element: Element | HTMLElement) {
    return 'offsetTop' in element ? element.offsetTop : 0
}
