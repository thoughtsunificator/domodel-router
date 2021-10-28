import assert from "assert"
import { JSDOM } from "jsdom"
import { Core, Binding, EventListener } from "domodel"

import RouterEventListener  from "../src/model/router.event.js"
import { RouterModel, RouterBinding, Router, Route, Link }  from "../index.js"

import View from "../src/object/view.js"

const url = "https://localhost"

const virtualDOM = new JSDOM(``, { url, })
const window = virtualDOM.window
const { document } = window

const RootModel = { tagName: "div" }
let rootBinding

describe("router.event", () => {

	beforeEach(() => {
		virtualDOM.reconfigure({ url })
		rootBinding = new Binding()
		Core.run(RootModel, { parentNode: document.body, binding: rootBinding })
	})

	afterEach(() => {
		rootBinding.remove()
	})

	it("instance", () => {
		assert.ok(RouterEventListener.prototype instanceof EventListener)
	})

	it("navigatePathName", (done) => {
		const router = new Router([], Router.TYPE.PATHNAME)
		const binding = new RouterBinding({ router })
		const link = new Link("/pathname")
		rootBinding.run(RouterModel, { binding })
		binding.listen(router, "browse", link => {
			assert.strictEqual(link.path, "/pathname")
			assert.strictEqual(document.location.href, `${url}/pathname`)
			done()
		})
		router.emit("navigate", link)
	})

	it("navigateHash", (done) => {
		const router = new Router([], Router.TYPE.HASH)
		const binding = new RouterBinding({ router })
		const link = new Link("/virtual")
		rootBinding.run(RouterModel, { binding })
		binding.listen(router, "browse", link => {
			assert.strictEqual(link.path, "/virtual")
			assert.strictEqual(document.location.href, `${url}/#/virtual`)
			done()
		})
		router.emit("navigate", link)
	})

	it("browse", (done) => {
		const model = data => ({
			tagName: "div"
		})
		const routes = [
			new Route("/", model, Binding),
			new Route("/cxzcxz", model, Binding),
			new Route("/gfgfd", model, Binding),
			new Route("/ytrzxxdsa/bcvcb", model, Binding),
		]
		const router = new Router(routes)
		const binding = new RouterBinding({ router })
		const link = new Link("/ytrzxxdsa/bcvcb", { test: "abc" })
		rootBinding.run(RouterModel, { binding })
		binding.listen(router, "routeSet", data => {
			assert.deepEqual(data.properties.test, "abc")
			assert.deepEqual(data.route, routes[3])
			done()
		})
		router.emit("browse", link)
	})

	it("routeSet", (done) => {
		let index = 0
		let removeCount = 0
		class MyBinding extends Binding {
			onCreated() {
				const { router } = this.properties
				assert.ok(router instanceof Router)
				assert.ok(router.view instanceof View)
				assert.ok(router.view.binding instanceof MyBinding)
				if(index === 0) {
					assert.strictEqual(router.view.parameters.text, undefined)
					assert.strictEqual(this.root.textContent, "")
				} else if(index === 1) {
					assert.strictEqual(removeCount, 1)
					assert.strictEqual(this.root.textContent, "2")
					assert.strictEqual(this.properties.myRouteProperty, "hello")
					assert.strictEqual(router.view.parameters.text, 2)
				} else if(index === 2) {
					assert.strictEqual(removeCount, 2)
					assert.strictEqual(this.root.textContent, "3")
					assert.strictEqual(this.properties.a, "b")
					assert.strictEqual(router.view.parameters.text, 3)
				} else if(index === 3) {
					assert.strictEqual(removeCount, 3)
					assert.strictEqual(this.root.textContent, "4")
					assert.strictEqual(this.properties.b, "c")
					assert.strictEqual(router.view.parameters.text, 4)
					done()
				}
				index++
			}
			remove() {
				removeCount++
				super.remove()
			}
		}
		const routes = [
			new Route("/", data => ({ tagName: "div", textContent: data.router.view.parameters.text }), MyBinding),
			new Route("/cxzcxz", data => ({ tagName: "div", textContent: data.router.view.parameters.text }), MyBinding, { myRouteProperty: "hello" }),
			new Route("/gfgfd", data => ({ tagName: "div", textContent: data.router.view.parameters.text }), MyBinding),
			new Route("/ytrzxxdsa/bcvcb", data => ({ tagName: "div", textContent: data.router.view.parameters.text }), MyBinding),
		]
		const router = new Router(routes)
		const binding = new RouterBinding({ router })
		rootBinding.run(RouterModel, { binding })
		router.emit("routeSet", { route: routes[1], parameters: { text: 2 } })
		router.emit("routeSet", { route: routes[2], parameters: { text: 3 }, properties: { a: "b" } })
		router.emit("routeSet", { route: routes[3], parameters: { text: 4 }, properties: { b: "c" } })
	})

})