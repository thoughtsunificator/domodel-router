import assert from "assert"
import { Binding, Observable } from "domodel"

import { Router, Route } from "../index.js"

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

describe("router", () => {

	it("types", () => {
		assert.strictEqual(Router.TYPE.VIRTUAL, "VIRTUAL")
		assert.strictEqual(Router.TYPE.PATHNAME, "PATHNAME")
		assert.strictEqual(Router.TYPE.HASH, "HASH")
	})

	it("instance", () => {
		const router = new Router([])
		assert.deepEqual(router.routes, [])
		assert.strictEqual(router.type, Router.TYPE.VIRTUAL)
		assert.strictEqual(router.errorRoute, undefined)
		assert.strictEqual(router.initialPath, "/")
		assert.ok(Router.prototype instanceof Observable)
		assert.throws(function() {
			route.routes = 1
			route.type = 1
			route.errorRoute = 1
			route.initialPath = 1
		})
		const router_ = new Router([], Router.TYPE.PATHNAME)
		assert.strictEqual(router_.type, Router.TYPE.PATHNAME)
		const router__ = new Router([], Router.TYPE.PATHNAME, { model: 1 })
		assert.strictEqual(router__.errorRoute.model, 1)
		const router___ = new Router([], Router.TYPE.PATHNAME, null, "/test")
		assert.strictEqual(router___.initialPath, "/test")
	})

	it("match", () => {
		const router = new Router(routes)
		assert.deepEqual(router.match("/").route, routes[0])
		assert.deepEqual(router.match("/test1").route, routes[1])
		assert.deepEqual(router.match("/cxzcxz").route, routes[2])
		assert.deepEqual(router.match("/xziutcxfgyduwdsa"), null)
		assert.deepEqual(router.match("/xvcdgs/8765").route, routes[3])
		assert.strictEqual(Object.keys(router.match("/xvcdgs/8765").parameters).length, 1)
		assert.strictEqual(router.match("/xvcdgs/8765").parameters.myprop, "8765")
		assert.strictEqual(Object.keys(router.match("/jhgyrtwe/test").parameters).length, 1)
		assert.strictEqual(router.match("/jhgyrtwe/test").parameters.propA, "jhgyrtwe")
	})

})
