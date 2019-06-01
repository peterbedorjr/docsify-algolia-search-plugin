/**
 * Check if value is a string
 *
 * @param {*} value
 */
export function isString(value) {
    return typeof value === 'string' || value instanceof String;
}

/**
 * Check if value is a number
 *
 * @param {*} value
 */
export function isNumber(value) {
    return typeof value === 'number' && isFinite(value);
}

/**
 * Check if value is an array
 *
 * @param {*} value
 */
export function isArray(value) {
    return Array.isArray(value);
}

/**
 * Check if value is a function
 *
 * @param {*} value
 */
export function isFunction (value) {
    return typeof value === 'function';
}

/**
 * Check if value is an object
 *
 * @param {*} value
 */
export function isObject(value) {
    return value && typeof value === 'object' && value.constructor === Object;
}
