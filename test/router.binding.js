import { JSDOM } from "jsdom"
import { Core, Binding } from "domodel"

import RouterModel from "../src/model/router.js"

import RouterBinding from "../src/model/router.binding.js"

import Router from "../src/object/router.js"
import Route from "../src/object/route.js"
import Link from "../src/object/link.js"
import View from "../src/object/view.js"

const url = "https://localhost/"

const virtualDOM = new JSDOM(``, { url, })
const window = virtualDOM.window
const { document } = window

const RootModel = { tagName: "div" }
let rootBinding

export function setUp(callback) {
	virtualDOM.reconfigure({ url })
	rootBinding = new Binding()
	Core.run(RootModel, { parentNode: document.body, binding: rootBinding })
	callback()
}

export function tearDown(callback) {
	rootBinding.remove()
	callback()
}

export function instance(test) {
	test.expect(1)
	test.ok(new RouterBinding() instanceof Binding)
	test.done()
}

export function onCreatedVirtual(test) {
	test.expect(1)
	const router = new Router([], Router.TYPE.VIRTUAL, null, "/virtual")
	const binding = new RouterBinding({ router })
	binding.listen(router, "browse", link => {
		test.strictEqual(link.path, "/virtual")
		test.done()
	})
	rootBinding.run(RouterModel, { binding })
}

export function onCreatedPathNameInitial(test) {
	test.expect(1)
	const router = new Router([], Router.TYPE.PATHNAME, null, "/pathname")
	const binding = new RouterBinding({ router })
	binding.listen(router, "browse", link => {
		test.strictEqual(link.path, "/pathname")
		test.done()
	})
	rootBinding.run(RouterModel, { binding })
}

export function onCreatedPathName(test) {
	test.expect(1)
	const router = new Router([], Router.TYPE.PATHNAME, null)
	const binding = new RouterBinding({ router })
	virtualDOM.reconfigure({ url: "https://localhost/pathname" })
	binding.listen(router, "browse", link => {
		test.strictEqual(link.path, "/pathname")
		test.done()
	})
	rootBinding.run(RouterModel, { binding })
}

export function onCreatedHashInitial(test) {
	test.expect(1)
	const router = new Router([], Router.TYPE.HASH, null, "/hash")
	const binding = new RouterBinding({ router })
	binding.listen(router, "navigate", link => {
		test.strictEqual(link.path, "/hash")
		test.done()
	})
	rootBinding.run(RouterModel, { binding })
}

export function onCreatedHash(test) {
	test.expect(1)
	const router = new Router([], Router.TYPE.HASH, null)
	const binding = new RouterBinding({ router })
	document.location.hash = "#/hash"
	binding.listen(router, "browse", link => {
		test.strictEqual(link.path, "/hash")
		test.done()
	})
	rootBinding.run(RouterModel, { binding })
}

export function navigatePathName(test) {
	test.expect(2)
	const router = new Router([], Router.TYPE.PATHNAME)
	const binding = new RouterBinding({ router })
	const link = new Link("/pathname")
	rootBinding.run(RouterModel, { binding })
	binding.listen(router, "browse", link => {
		test.strictEqual(link.path, "/pathname")
		test.strictEqual(document.location.href, "https://localhost/pathname")
		test.done()
	})
	router.emit("navigate", link)
}

export function navigateHash(test) {
	test.expect(2)
	const router = new Router([], Router.TYPE.HASH)
	const binding = new RouterBinding({ router })
	const link = new Link("/virtual")
	rootBinding.run(RouterModel, { binding })
	binding.listen(router, "browse", link => {
		test.strictEqual(link.path, "/virtual")
		test.strictEqual(document.location.href, "https://localhost/#/virtual")
		test.done()
	})
	router.emit("navigate", link)
}

export function browse(test) {
	test.expect(1)
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
	const link = new Link("/ytrzxxdsa/bcvcb")
	rootBinding.run(RouterModel, { binding })
	binding.listen(router, "route set", data => {
		test.deepEqual(data.route, routes[3])
		test.done()
	})
	router.emit("browse", link)
}

export function routeSet(test) {
	test.expect(23)
	let index = 0
	let removeCount = 0
	class MyBinding extends Binding {
		onCreated() {
			const { router } = this.properties
			test.ok(router instanceof Router)
			test.ok(router.view instanceof View)
			test.ok(router.view.binding instanceof MyBinding)
			if(index === 0) {
				test.strictEqual(router.view.parameters.text, undefined)
				test.strictEqual(this.root.textContent, "")
			} else if(index === 1) {
				test.strictEqual(removeCount, 1)
				test.strictEqual(this.root.textContent, "2")
				test.strictEqual(router.view.parameters.text, 2)
			} else if(index === 2) {
				test.strictEqual(removeCount, 2)
				test.strictEqual(this.root.textContent, "3")
				test.strictEqual(router.view.parameters.text, 3)
			} else if(index === 3) {
				test.strictEqual(removeCount, 3)
				test.strictEqual(this.root.textContent, "4")
				test.strictEqual(router.view.parameters.text, 4)
				test.done()
			}
			index++
		}
		remove() {
			removeCount++
			super.remove()
		}
	}
	const routes = [
		new Route("/", router => ({ tagName: "div", textContent: router.view.parameters.text }), MyBinding),
		new Route("/cxzcxz", router => ({ tagName: "div", textContent: router.view.parameters.text }), MyBinding),
		new Route("/gfgfd", router => ({ tagName: "div", textContent: router.view.parameters.text }), MyBinding),
		new Route("/ytrzxxdsa/bcvcb", router => ({ tagName: "div", textContent: router.view.parameters.text }), MyBinding),
	]
	const router = new Router(routes)
	const binding = new RouterBinding({ router })
	rootBinding.run(RouterModel, { binding })
	router.emit("route set", { route: routes[1], parameters: { text: 2 } })
	router.emit("route set", { route: routes[2], parameters: { text: 3 } })
	router.emit("route set", { route: routes[3], parameters: { text: 4 } })
}

export function popStatePathName(test) {
	const router = new Router([], Router.TYPE.PATHNAME)
	const binding = new RouterBinding({ router })
	rootBinding.run(RouterModel, { binding })
	binding.listen(router, "browse", link => {
		test.strictEqual(link.path, "/vcxvuygwqeguyidsa321")
		test.done()
	})
	virtualDOM.reconfigure({ url: "https://localhost/vcxvuygwqeguyidsa321" })
	window.dispatchEvent(new window.PopStateEvent('popstate'))
}

export function popStateHash(test) {
	test.expect(4)
	const router = new Router([], Router.TYPE.HASH)
	const binding = new RouterBinding({ router })
	rootBinding.run(RouterModel, { binding })
	let index = 0
	binding.listen(router, "navigate", link => {
		if(index === 0) {
			test.strictEqual(link.path, "/")
		} else if(index === 1) {
			test.strictEqual(link.path, "/")
		}
		index++
	})
	virtualDOM.reconfigure({ url: "https://localhost/" })
	window.dispatchEvent(new window.PopStateEvent('popstate'))
	virtualDOM.reconfigure({ url: "https://localhost/#" })
	window.dispatchEvent(new window.PopStateEvent('popstate'))
	binding.listen(router, "browse", link => {
		test.strictEqual(index, 2)
		test.strictEqual(link.path, "/test")
		test.done()
	})
	virtualDOM.reconfigure({ url: "https://localhost/#/test" })
	window.dispatchEvent(new window.PopStateEvent('popstate'))
}
