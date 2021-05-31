import { getRandomInt } from "./number";

export function getRandomArrElement<T>(arr: Array<T>) {
    return arr[getRandomInt(arr.length)];
}