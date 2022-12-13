export function createListId() {
    return Math.floor(Math.random() * 10000000)
}


export function reorder(initialArr, order, key) {
    let newArr = initialArr.sort((a, b) => order.indexOf(a[key]) - order.indexOf(b[key]))
    return newArr
}

export function updateOrder(source, target, arr) {
    const sourceIdx = arr.indexOf(source)
    const targetIdx = arr.indexOf(target)
    if (sourceIdx < targetIdx) {
        // if drag element from left to right, place source right after target
        arr.splice(sourceIdx, 1)
        // targetIdx is now -1
        const newTargetIdx = arr.indexOf(target)

        arr.splice(newTargetIdx + 1, 0, source)
        // console.log(arr)
    } else {
        // if drag element from right to left, place source right before target
        arr.splice(sourceIdx, 1)
        arr.splice(targetIdx, 0, source)
        // console.log(arr)
    }
}


export function saveToLocal(key, data) {
    localStorage.setItem(key, JSON.stringify(data))
}


export function getFromLocal(key) {
    return JSON.parse(localStorage.getItem(key))
}


export function deleteFromArr(ele, arr) {
    if (Array.isArray(arr)) {
        let index = arr.indexOf(ele)
        if (index != -1) {
            arr.splice(index, 1)
        }
    }
}
