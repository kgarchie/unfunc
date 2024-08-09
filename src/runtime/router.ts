import { glob } from "fast-glob"
import { constructCallback } from "./helpers"
import { defineEventHandler } from "h3"
import { normalize } from "pathe"
import type { H3Event } from "h3"
import consola from "consola"
import { createRouter as _createRadix } from "radix3"
import { createRouter as _createRouter, createApp } from "h3"


async function findStoreFiles(location: string) {
    const patterns = [
        "**/[A-Z]*/store.[jt]s",
        "**/[A-Z]*.[jt]s"
    ]
    const files = await glob(patterns, {
        cwd: location,
        onlyFiles: true,
        ignore: ["node_modules"],
        absolute: true
    }).catch((e) => {
        console.error(e)
        return []
    })
    return files
}

async function constructRouterCallbacks(file: string, route: string) {
    const withoutExt = file.split(".").at(0)
    const imports = await import(withoutExt)
    const routes = new Map<string, (event: H3Event) => any>()

    if (imports.default) {
        consola.info(`Adding class route: ${route}`)
        const callback = constructCallback(imports.default)
        routes.set(route, callback)
    } else {
        for (const key in imports) {
            if (key === 'default' || key === '__is_handler__') continue
            consola.info(`Adding route: ${route}/${key}`)
            const callback = constructCallback(imports[key])
            routes.set(`${route}/${key}`, callback)
        }
    }

    return routes
}

function getRoute(base: string, file: string) {
    const _base = normalize(base).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(_base);
    const route = file.replace(regex, "").replace(/\.[jt]s$/, "")
    return route
}

async function handler(base: string, file: string) {
    const route = getRoute(base, file)
    return await constructRouterCallbacks(file, route)
}

async function createRouter(location: string) {
    const radix = _createRadix()
    const router = _createRouter()
    const files = await findStoreFiles(location)
    const _routes = await Promise.allSettled(files.map((file: string) => handler(location, file)))
    _routes.forEach((route) => {
        if (route.status === "fulfilled") {
            const { value } = route
            value.forEach((callback, route) => {
                const _route = route.replace(/\[([a-zA-Z0-9]+)\]/g, ":$1")
                radix.insert(_route, {})
                router.use(_route, defineEventHandler(callback))
            })
        } else {
            console.error(route.reason)
        }
    })
    return { radix, router }
}

export default createRouter