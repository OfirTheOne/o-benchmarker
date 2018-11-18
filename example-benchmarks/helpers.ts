export function randomArray(size = 10000) {
    const arr = [];
    for(let i = 0; i < size; i++) {
        const num = Math.floor(Math.random() * size);
        arr.push(num);
    }
    return arr;
}