export function getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
}

export function isNumeric(str: string) {
    if (typeof str != "string") return false // we only process strings!
    str = str.replace(",", ".");
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}