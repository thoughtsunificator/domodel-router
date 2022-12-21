import assert from "assert"
import { JSDOM } from "jsdom"
import { Core, Binding, EventListener, Model } from "domodel"

import RouterEventListener  from "../src/model/router.event.js"
import { RouterModel, RouterBinding, Router, Route, Link, Match }  from "../index.js"

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
		const router = new Router({
			routes: [],
			type: Router.TYPE.PATHNAME
		})
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

	it("navigatePathNameBasePath", (done) => {
		const router = new Router({
			routes: [],
			type: Router.TYPE.PATHNAME,
			basePath: "/test"
		})
		const binding = new RouterBinding({ router })
		const link = new Link("/pathname")
		rootBinding.run(RouterModel, { binding })
		binding.listen(router, "browse", link => {
			assert.strictEqual(link.path, "/pathname")
			assert.strictEqual(document.location.href, `${url}/test/pathname`)
			done()
		})
		router.emit("navigate", link)
	})

	it("navigateHash", (done) => {
		const router = new Router({
			routes: [],
			type: Router.TYPE.HASH
		})
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

	describe("browse", () => {
		it("without properties", done => {
			const model = data => ({
				tagName: "div"
			})
			const routes = [
				new Route({
					match: "/",
					model: new Model(model, Binding)
				}),
				new Route({
					match: "/cxzcxz",
					model: new Model(model, Binding)
				}),
				new Route({
					match: "/gfgfd",
					model: new Model(model, Binding)
				}),
				new Route({
					match: "/ytrzxxdsa/bcvcb",
					model: new Model(model, Binding)
				}),
			]
			const router = new Router({ routes })
			const binding = new RouterBinding({ router })
			const link = new Link("/ytrzxxdsa/bcvcb", { test: "abc" })
			rootBinding.run(RouterModel, { binding })
			binding.listen(router, "routeSet", data => {
				assert.ok(data.match instanceof Match)
				assert.ok(data.link instanceof Link)
				assert.deepEqual(data.link.properties.test, "abc")
				assert.deepEqual(data.match.route, routes[3])
				done()
			})
			router.emit("browse", link)
			assert.strictEqual(router.path, link.path)
		})
		it("with properties", done => {
			const model = data => ({
				tagName: "div",
				data
			})
			const routes = [
				new Route({
					match: "/",
					model: new Model(model, Binding)
				}),
				new Route({
					match: "/cxzcxz",
					model: new Model(model, Binding)
				}),
				new Route({
					match: "/gfgfd",
					model: new Model(model, Binding)
				}),
				new Route({
					match: "/ytrzxxdsa/bcvcb",
					model: new Model(model, Binding)
				}),
			]
			const router = new Router({ routes })
			const binding = new RouterBinding({ router })
			const link = new Link("/ytrzxxdsa/bcvcb", { test: "abc" })
			rootBinding.run(RouterModel, { binding })
			binding.listen(router, "routeSet", data => {
				assert.ok(data.match instanceof Match)
				assert.ok(data.link instanceof Link)
				assert.deepEqual(data.link.properties.test, "abc")
				assert.deepEqual(data.match.route, routes[3])
				assert.deepEqual(binding._children[0].root.data, { router, test: "abc" })
				done()
			})
			router.emit("browse", link)
			assert.strictEqual(router.path, link.path)
		})
	})

	it("browse middleware", () => {
		const model = data => ({
			tagName: "div"
		})
		const routes = [
			new Route({
				match: "/",
				model: new Model(model, Binding)
			}),
			new Route({
				match: "/unauthorized",
				model: new Model(model, Binding)
			}),
			new Route({
				match: "/protected",
				model: new Model(model, Binding),
				middleware: (properties) => {
					properties.router.emit("browse", new Link("/unauthorized", { redirected: true }))
					return true
				}
			}),
		]
		const router = new Router({ routes })
		const binding = new RouterBinding({ router })
		const link = new Link("/protected")
		rootBinding.run(RouterModel, { binding })
		assert.strictEqual(router.path, "/")
		binding.listen(router, "routeSet", data => {
			assert.deepEqual(data.link.path, "/unauthorized")
			assert.deepEqual(data.link.properties.redirected, true)
			assert.deepEqual(data.match.route, routes[1])
			assert.strictEqual(router.path, "/unauthorized")
		})
		router.emit("browse", link)
		assert.strictEqual(router.path, "/unauthorized")
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
				} else if(index === 4) {
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
			new Route({
				match: "/",
				model: new Model(data => ({ tagName: "div", textContent: data.router.view.parameters.text }), MyBinding),
			}),
			new Route({
				match: "/cxzcxz",
				model: new Model(data => ({ tagName: "div", textContent: data.router.view.parameters.text }), MyBinding, { myRouteProperty: "hello" }),
			}),
			new Route({
				match: "/gfgfd",
				model: new Model(data => ({ tagName: "div", textContent: data.router.view.parameters.text }), MyBinding),
			}),
			new Route({
				match: "/ytrzxxdsa/bcvcb",
				model: new Model(data => ({ tagName: "div", textContent: data.router.view.parameters.text }), MyBinding),
			}),
		]
		const router = new Router({ routes })
		const binding = new RouterBinding({ router })
		rootBinding.run(RouterModel, { binding })
		router.emit("routeSet", { match: new Match(routes[1], { text: 2 }), link: new Link("/cxzcxz") })
		router.emit("routeSet", { match: new Match(routes[2], { text: 3 }), link: new Link("/gfgfd", { a: "b" }) })
		router.emit("routeSet", { match: new Match(routes[3], { text: 4 }), link: new Link("/ytrzxxdsa/bcvcb", { b: "c" }) })
	})

	it("routeSet layout", () => {
		class myBinding extends Binding {
			onCreated() {
				this.root.textContent = "Hello World"
			}
		}
		const routes = [
			new Route({
				match: "/test1",
				model: new Model(() => ({ tagName: "div", textContent: "Test" }), Binding),
				layout: new Model({ tagName: "div", textContent: "Test1", identifier: "view" }, Binding)
			}),
			new Route({
				match: "/test2",
				model: new Model(() => ({ tagName: "div", textContent: "Test" }), Binding),
				layout: new Model({ tagName: "div", textContent: "Test2", identifier: "view" }, myBinding)
			}),
			new Route({
				match: "/test3",
				model: new Model(() => ({ tagName: "div", textContent: "Test" }), Binding),
			}),
		]
		const router = new Router({ routes })
		const binding = new RouterBinding({ router })
		rootBinding.run(RouterModel, { binding })
		router.emit("routeSet", { match: new Match(routes[0]), link: new Link("/test1") })
		assert.strictEqual(binding.root.innerHTML, "<div>Test1<div>Test</div></div>")
		router.emit("routeSet", { match: new Match(routes[1]), link: new Link("/test2") })
		assert.strictEqual(binding.root.innerHTML, "<div>Hello World<div>Test</div></div>")
		router.emit("routeSet", { match: new Match(routes[2]), link: new Link("/test3") })
		assert.strictEqual(binding.root.innerHTML, "<div>Test</div>")
	})

	it("routeSet defaultLayout", () => {
		class myBinding extends Binding {
			onCreated() {
				this.root.textContent = "Hello World"
			}
		}
		const routes = [
			new Route({
				match: "/test1",
				model: new Model(() => ({ tagName: "div", textContent: "Test" }), Binding),
				layout: new Model({ tagName: "div", textContent: "Test1", identifier: "view" }, Binding)
			}),
			new Route({
				match: "/test2",
				model: new Model(() => ({ tagName: "div", textContent: "Test" }), Binding),
			}),
		]
		const router = new Router({
			routes,
			type: Router.TYPE.VIRTUAL,
			defaultLayout: new Model({ tagName: "div", textContent: "Test2", identifier: "view" }, Binding)
		})
		const binding = new RouterBinding({ router })
		rootBinding.run(RouterModel, { binding })
		router.emit("routeSet", { match: new Match(routes[0]), link: new Link("/test1") })
		assert.strictEqual(binding.root.innerHTML, "<div>Test1<div>Test</div></div>")
		router.emit("routeSet", { match: new Match(routes[1]), link: new Link("/test2") })
		assert.strictEqual(binding.root.innerHTML, "<div>Test2<div>Test</div></div>")
	})

})
