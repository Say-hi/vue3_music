export function shuffle<T>(source: Array<T>) {
    const arr = source.slice()
    for (let i = 0; i< arr.length; i++) {
        const j = getRandomInt(i)
        swap<T>(arr, i, j)
    }
    return arr
}

function getRandomInt(max: number): number {
    return Math.floor(Math.random() * (max + 1))
}

function swap<T>(arr: Array<T>, i: number, j: number) {
    const t = arr[i]
    arr[i] = arr[j]
    arr[j] = t
}

export function formatTime (time: number = 0) {
    time = time | 0
    const m = String((time / 60 | 0)).padStart(2, '0')
    const s = String(time % 60).padStart(2, '0')
    return `${m}:${s}`
}