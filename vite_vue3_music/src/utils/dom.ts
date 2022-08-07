export function addClass(el: Element, className: string): void {
    if (!el.classList.contains(className)) {
        el.classList.add(className)
    }
}

export function removeClass(el: Element, className: string): void {
    el.classList.remove(className)
}