import assert from "assert"
import { Binding, Observable } from "domodel"

import { Router, Route, Match } from "../index.js"

import ErrorModel from "../src/model/error.js"

const url = "https://localhost/"

const model = {
	tagName: "div"
}

const routes = [
	new Route("/", model, Binding),
	new Route("/test1", model, Binding),
	new Route("/cxzcxz", model, Binding),
	new Route("/xvcdgs/{myprop}", model, Binding),
	new Route("/test1/dsadsa", model, Binding),
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
		assert.ok(router.errorRoute instanceof Route)
		assert.strictEqual(router.errorRoute.model, ErrorModel)
		assert.strictEqual(router.initialPath, "/")
		assert.strictEqual(router.path, null)
		assert.ok(Router.prototype instanceof Observable)
		assert.throws(function() {
			route.routes = 1
			route.path = 1
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
		assert.strictEqual(new Router([], Router.TYPE.VIRTUAL, null, "/").errorRoute.model, ErrorModel)
	})

	it("match", () => {
		const router = new Router(routes)
		assert.ok(router.match("/") instanceof Match)
		assert.strictEqual(router.match("/").route, routes[0])
		assert.strictEqual(router.match("/test1").route, routes[1])
		assert.strictEqual(router.match("/test1/").route, routes[1])
		assert.strictEqual(router.match("/test1/dsadsa").route, routes[4])
		assert.strictEqual(router.match("/test1/dsadsa/").route, routes[4])
		assert.strictEqual(router.match("/test1/dsadsa "), null)
		assert.strictEqual(router.match("/cxzcxz").route, routes[2])
		assert.strictEqual(router.match("/xziutcxfgyduwdsa"), null)
		assert.strictEqual(router.match("/xvcdgs/8765").route, routes[3])
		assert.strictEqual(Object.keys(router.match("/xvcdgs/8765").parameters).length, 1)
		assert.strictEqual(router.match("/xvcdgs/8765").parameters.myprop, "8765")
		assert.strictEqual(Object.keys(router.match("/jhgyrtwe/test").parameters).length, 1)
		assert.strictEqual(router.match("/jhgyrtwe/test").parameters.propA, "jhgyrtwe")
		assert.strictEqual(router.match("/jhgyrtwe/test").route, routes[5])
		assert.strictEqual(router.match("/jhgyrtwe/test/").route, routes[5])
		assert.strictEqual(router.match("/jhgyrtwecxzcxzczx/test").route, routes[5])
		assert.strictEqual(router.match("/jhgyrtwecxzcxzczx/test/").route, routes[5])
		assert.strictEqual(router.match("//jhgyrtwecxzcxzczx/test"), null)
		assert.strictEqual(router.match("/jhgyrtwecxzcxzczx/test2"), null)
	})

})
