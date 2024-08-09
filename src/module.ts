import { defineNuxtModule, createResolver, addServerScanDir } from '@nuxt/kit'
import { join, resolve, relative } from 'pathe'
import createRouter from "./runtime/router"
import { toNodeListener, createApp } from "h3"

// Module options TypeScript interface definition
export interface ModuleOptions {
  /**
   * The location of the stores directory
   * @default '/server/stores/'
   */
  location?: string
  /**
   * The API route to use
   * @default '/__armon__'
   */
  apiRoute?: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@chiballc/unfunc',
    configKey: 'unfunc',
  },
  defaults: {
    location: '/server/stores/',
    apiRoute: '/__armon__/',
  },
  async setup(_options, _nuxt) {
    _nuxt.options.vite ??= {}
    _nuxt.options.vite.optimizeDeps ??= {}
    _nuxt.options.vite.optimizeDeps.exclude ??= []
    _nuxt.options.vite.optimizeDeps.exclude.push('unfunc')

    const resolver = createResolver(import.meta.url)
    const storesDir = () => join(resolve(_nuxt.options.srcDir), resolve(_options.location))
    addServerScanDir(storesDir())

    const app = createApp()
    const { router, radix } = await createRouter(storesDir())
    app.use(router)
    _nuxt.hook("listen", async (listenerServer) => {
      listenerServer.on('request', async (req, res) => {
        const unfunc = radix.lookup(req.url)
        if (unfunc) return toNodeListener(app)(req, res)
      })
    })

    _nuxt.hook("builder:watch", async (e, path) => {
      const target = _options.location.replace(/^\//, '')
      path = path.replace(/^\//, '')

      if (!path.startsWith(target)) return
      let {router, radix} = await createRouter(storesDir())
      
      app.use(router)
      await _nuxt.callHook('builder:generateApp')
    })
  },
})
