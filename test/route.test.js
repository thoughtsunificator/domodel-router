import assert from "assert"
import { Binding } from "domodel"

import { Route } from "../index.js"

describe("route", () => {

	it("instance", () => {
		const model = { tagName: "div" }
		const middleware = () => {}
		const properties = {}
		const route = new Route("/test", model, Binding, properties, middleware)
		assert.strictEqual(route.match, "/test")
		assert.deepEqual(route.model, model)
		assert.deepEqual(route.properties, properties)
		assert.deepEqual(route.middleware, middleware)
		assert.throws(function() {
			route.match = 1
			route.model = 1
			route.binding = 1
			route.middleware= 1
			route.layout = 1
		})
	})

})
