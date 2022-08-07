export function save<T>(item: T, key: string, compare: (value: T, index: number, obj: T[]) => unknown, maxlength?: number) {
    const items = JSON.parse(localStorage.getItem(key) || "[]") as T[]
    insertArray(items, item, compare, maxlength)
    localStorage.setItem(key, JSON.stringify(items))
    return items
}

export function remove<T>(key: string, compare: (value: T, index: number, obj: T[]) => unknown){
    const items = JSON.parse(localStorage.getItem(key) || "[]") as T[]
    delteFromArray(items, compare)
    localStorage.setItem(key, JSON.stringify(items))
    return items
}

function insertArray<T>(arr: Array<T>, val: T, compare: (value: T, index: number, obj: T[]) => unknown, maxlength?: number) {
    const index = arr.findIndex(compare)
    if (index > -1) {
        return
    }
    arr.unshift(val)
    if(maxlength && arr.length > maxlength) {
        arr.pop()
    }
}

function delteFromArray<T>(arr: Array<T>, compare: (value: T, index: number, obj: T[]) => unknown) {
    const index = arr.findIndex(compare)
    if (index > -1) {
        arr.splice(index, 1)
    }
}

export function load<T>(key: string) {
    return JSON.parse(localStorage.getItem(key) || "[]") as T[]
}

export function cleanLocal(key: string) {
    localStorage.removeItem(key)
}