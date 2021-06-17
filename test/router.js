import { Binding, Observable } from "domodel"

import Router from "../src/object/router.js"
import Route from "../src/object/route.js"

const url = "https://localhost/"

const model = {
	tagName: "div"
}

const routes = [
	new Route("/", model, Binding),
	new Route("/test1", model, Binding),
	new Route("/cxzcxz", model, Binding),
	new Route("/xvcdgs/{myprop}", model, Binding),
	new Route("/{propA}/test", model, Binding),
]

export function types(test) {
	test.expect(3)
	test.strictEqual(Router.TYPE.VIRTUAL, "VIRTUAL")
	test.strictEqual(Router.TYPE.PATHNAME, "PATHNAME")
	test.strictEqual(Router.TYPE.HASH, "HASH")
	test.done()
}

export function instance(test) {
	test.expect(9)
	const router = new Router([])
	test.deepEqual(router.routes, [])
	test.strictEqual(router.type, Router.TYPE.VIRTUAL)
	test.strictEqual(router.errorRoute, undefined)
	test.strictEqual(router.initialPath, "/")
	test.ok(router instanceof Observable)
	test.throws(function() {
		route.routes = 1
		route.type = 1
		route.errorRoute = 1
		route.initialPath = 1
	})
	const router_ = new Router([], Router.TYPE.PATHNAME)
	test.strictEqual(router_.type, Router.TYPE.PATHNAME)
	const router__ = new Router([], Router.TYPE.PATHNAME, { model: 1 })
	test.strictEqual(router__.errorRoute.model, 1)
	const router___ = new Router([], Router.TYPE.PATHNAME, null, "/test")
	test.strictEqual(router___.initialPath, "/test")
	test.done()
}

export function match(test) {
	test.expect(9)
	const router = new Router(routes)
	test.deepEqual(router.match(new URL("/", url)).route, routes[0])
	test.deepEqual(router.match(new URL("/test1", url)).route, routes[1])
	test.deepEqual(router.match(new URL("/cxzcxz", url)).route, routes[2])
	test.deepEqual(router.match(new URL("/xziutcxfgyduwdsa", url)), null)
	test.deepEqual(router.match(new URL("/xvcdgs/8765", url)).route, routes[3])
	test.strictEqual(Object.keys(router.match(new URL("/xvcdgs/8765", url)).parameters).length, 1)
	test.strictEqual(router.match(new URL("/xvcdgs/8765", url)).parameters.myprop, "8765")
	test.strictEqual(Object.keys(router.match(new URL("/jhgyrtwe/test", url)).parameters).length, 1)
	test.strictEqual(router.match(new URL("/jhgyrtwe/test", url)).parameters.propA, "jhgyrtwe")
	test.done()
}
