import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'
import { join, resolve } from 'pathe'
import createRouter from "./runtime/router"

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
    const resolver = createResolver(import.meta.url)
    const storesDir = join(resolve(_nuxt.options.srcDir), resolve(_options.location))

    _nuxt.options.vite ??= {}
    _nuxt.options.vite.optimizeDeps ??= {}
    _nuxt.options.vite.optimizeDeps.exclude ??= []
    _nuxt.options.vite.optimizeDeps.exclude.push('unfunc')

    const router = await createRouter(storesDir)
    
    
    addPlugin(resolver.resolve('./runtime/plugin'))
  },
})
