import assert from "assert"
import { Binding, Model } from "domodel"

import { Route } from "../index.js"

describe("route", () => {

	it("instance", () => {
		const properties = {}
		const MyModel = new Model({ tagName: "div" }, Binding, properties)
		const model = new Model(MyModel)
		const middleware = () => {}
		const route = new Route({
			match: "/test",
			model: new Model(MyModel),
			middleware
		})
		assert.strictEqual(route.match, "/test")
		assert.deepEqual(route.model, model)
		assert.deepEqual(route.middleware, middleware)
		assert.throws(function() {
			route.match = 1
			route.model = 1
			route.middleware= 1
			route.layout = 1
		})
	})

})
