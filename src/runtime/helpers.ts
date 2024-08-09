import { H3Event } from "h3";

export function constructCallback(_import: any) {
    function callMethod(_class: any, method: string, event: H3Event) {
        if (_class[method]) {
            return _class[method](event)
        } else {
            const _new = new _class()
            if (_new[method]) {
                return _new[method](event)
            } else {
                throw new Error("Method not found")
            }
        }
    }
    if (isClass(_import)) {
        return function eventHandler(event: H3Event) {
            switch (event.method) {
                case "GET":
                    return callMethod(_import, 'get', event)
                case "POST":
                    return callMethod(_import, 'post', event)
                case "PUT":
                    return callMethod(_import, 'put', event)
                case "DELETE":
                    return callMethod(_import, 'delete', event)
                case "PATCH":
                    return callMethod(_import, 'patch', event)
                case "CONNECT":
                    return callMethod(_import, 'connect', event)
                case "OPTIONS":
                    return callMethod(_import, 'options', event)
                case "TRACE":
                    return callMethod(_import, 'trace', event)
                case "HEAD":
                    return callMethod(_import, 'head', event)
                default:
                    throw new Error("Method not allowed")
            }
        }
    } else {
        return function eventHandler(event: H3Event) {
            return _import(event)
        }
    }
}

function isClass(obj: any) {
    const isCtorClass = obj.constructor
        && obj.constructor.toString().substring(0, 5) === 'class'
    if (obj.prototype === undefined) {
        return isCtorClass
    }
    const isPrototypeCtorClass = obj.prototype.constructor
        && obj.prototype.constructor.toString
        && obj.prototype.constructor.toString().substring(0, 5) === 'class'
    return isCtorClass || isPrototypeCtorClass
}