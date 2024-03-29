import assert from "assert"
import { Binding, Observable, Model } from "domodel"

import { Router, Route, Match } from "../index.js"

import ErrorModel from "../src/model/error.js"

const url = "https://localhost/"

const MyModel = {
	tagName: "div"
}

const routes = [
	new Route({
		match: "/",
		model: new Model(MyModel),
	}),
	new Route({
		match: "/test1",
		model: new Model(MyModel),
	}),
	new Route({
		match: "/cxzcxz",
		model: new Model(MyModel),
	}),
	new Route({
		match: "/xvcdgs/{myprop}",
		model: new Model(MyModel),
	}),
	new Route({
		match: "/test1/dsadsa",
		model: new Model(MyModel),
	}),
	new Route({
		match: "/{propA}/test",
		model: new Model(MyModel),
	}),
]

describe("router", () => {

	it("types", () => {
		assert.strictEqual(Router.TYPE.VIRTUAL, "VIRTUAL")
		assert.strictEqual(Router.TYPE.PATHNAME, "PATHNAME")
		assert.strictEqual(Router.TYPE.HASH, "HASH")
	})

	it("instance", () => {
		const router = new Router({ routes: [] })
		assert.deepEqual(router.routes, [])
		assert.strictEqual(router.type, Router.TYPE.VIRTUAL)
		assert.ok(router.errorRoute instanceof Route)
		assert.strictEqual(router.errorRoute.model.definition, ErrorModel)
		assert.strictEqual(router.initialPath, "/")
		assert.strictEqual(router.path, null)
		assert.ok(Router.prototype instanceof Observable)
		assert.throws(function() {
			route.routes = 1
			route.path = 1
			route.type = 1
			route.errorRoute = 1
			route.initialPath = 1
			route.defaultLayout = 1
			route.basePath = 1
		})
		const router_ = new Router({
			routes: [],
			type: Router.TYPE.PATHNAME
		})
		assert.strictEqual(router_.type, Router.TYPE.PATHNAME)
		const errorModel = { tagName: "div" }
		const router__ = new Router({
			routes: [],
			type: Router.TYPE.PATHNAME,
			errorRoute: new Route({
				model: new Model(errorModel)
			}),
			basePath: "/test"
		})
		assert.strictEqual(router__.errorRoute.model.definition, errorModel)
		assert.strictEqual(router__.basePath, "/test")
		const router___ = new Router({
			routes: [],
			type: Router.TYPE.PATHNAME,
			initialPath: "/test"
		})
		assert.strictEqual(router___.initialPath, "/test")
		assert.strictEqual(new Router({
			routes: [],
			type: Router.TYPE.VIRTUAL,
			initialPath: "/"
		}).errorRoute.model.definition, ErrorModel)
	})

	it("match", () => {
		const router = new Router({
			routes
		})
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
