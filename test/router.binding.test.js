import assert from "assert"
import { JSDOM } from "jsdom"
import { Core, Binding, EventListener } from "domodel"

import { RouterModel, RouterBinding, Router, Route, Link }  from "../index.js"

import View from "../src/object/view.js"

const url = "https://localhost"

const virtualDOM = new JSDOM(``, { url, })
const window = virtualDOM.window
const { document } = window

const RootModel = { tagName: "div" }
let rootBinding

describe("router.binding", () => {

	beforeEach(() => {
		virtualDOM.reconfigure({ url })
		rootBinding = new Binding()
		Core.run(RootModel, { parentNode: document.body, binding: rootBinding })
	})

	afterEach(() => {
		rootBinding.remove()
	})

	it("instance", () => {
		assert.ok(RouterBinding.prototype instanceof Binding)
	})

	it("onCreatedVirtual", (done) => {
		const router = new Router([], Router.TYPE.VIRTUAL, null, "/virtual")
		const binding = new RouterBinding({ router })
		binding.listen(router, "browse", link => {
			assert.strictEqual(link.path, "/virtual")
			done()
		})
		rootBinding.run(RouterModel, { binding })
		assert.strictEqual(router.path, "/virtual")
	})

	it("onCreatedPathNameInitial", (done) => {
		const router = new Router([], Router.TYPE.PATHNAME, null, "/pathname")
		const binding = new RouterBinding({ router })
		binding.listen(router, "browse", link => {
			assert.strictEqual(link.path, "/pathname")
			done()
		})
		rootBinding.run(RouterModel, { binding })
		assert.strictEqual(router.path, "/pathname")
	})

	it("onCreatedPathName", (done) => {
		const router = new Router([], Router.TYPE.PATHNAME, null)
		const binding = new RouterBinding({ router })
		virtualDOM.reconfigure({ url: `${url}/pathname` })
		binding.listen(router, "browse", link => {
			assert.strictEqual(link.path, "/pathname")
			done()
		})
		rootBinding.run(RouterModel, { binding })
		assert.strictEqual(router.path, "/pathname")
	})

	it("onCreatedHashInitial", (done) => {
		const router = new Router([], Router.TYPE.HASH, null, "/hash")
		const binding = new RouterBinding({ router })
		binding.listen(router, "navigate", link => {
			assert.strictEqual(link.path, "/hash")
			done()
		})
		rootBinding.run(RouterModel, { binding })
		assert.strictEqual(router.path, "/hash")
	})

	it("onCreatedHash", (done) => {
		const router = new Router([], Router.TYPE.HASH, null)
		const binding = new RouterBinding({ router })
		virtualDOM.reconfigure({ url: `${url}/#/hash` })
		binding.listen(router, "browse", link => {
			assert.strictEqual(link.path, "/hash")
			done()
		})
		rootBinding.run(RouterModel, { binding })
		assert.strictEqual(router.path, "/hash")
	})

	it("onCreatedInitialPathNull", () => {
		const router = new Router([], Router.TYPE.VIRTUAL, null, null)
		const binding = new RouterBinding({ router })
		rootBinding.run(RouterModel, { binding })
		assert.strictEqual(router.view, null)
		assert.strictEqual(router.path, null)
	})

	it("popStatePathName", (done) => {
		const router = new Router([], Router.TYPE.PATHNAME)
		const binding = new RouterBinding({ router })
		rootBinding.run(RouterModel, { binding })
		binding.listen(router, "browse", link => {
			assert.strictEqual(link.path, "/vcxvuygwqeguyidsa321")
			done()
		})
		virtualDOM.reconfigure({ url: `${url}/vcxvuygwqeguyidsa321` })
		window.dispatchEvent(new window.PopStateEvent('popstate'))
		assert.strictEqual(router.path, "/vcxvuygwqeguyidsa321")
	})

	it("popStateHash", (done) => {
		const router = new Router([], Router.TYPE.HASH)
		const binding = new RouterBinding({ router })
		rootBinding.run(RouterModel, { binding })
		let index = 0
		binding.listen(router, "navigate", link => {
			if(index === 0) {
				assert.strictEqual(link.path, "/")
			} else if(index === 1) {
				assert.strictEqual(link.path, "/")
			}
			index++
		})
		virtualDOM.reconfigure({ url: `${url}/` })
		window.dispatchEvent(new window.PopStateEvent('popstate'))
		virtualDOM.reconfigure({ url: `${url}/#` })
		window.dispatchEvent(new window.PopStateEvent('popstate'))
		binding.listen(router, "browse", link => {
			assert.strictEqual(index, 2)
			assert.strictEqual(link.path, "/test")
			done()
		})
		virtualDOM.reconfigure({ url: `${url}/#/test` })
		window.dispatchEvent(new window.PopStateEvent('popstate'))
	})

})
