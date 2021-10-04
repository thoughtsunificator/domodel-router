import assert from "assert"
import { Binding } from "domodel"

import { Route } from "../index.js"

describe("route", () => {

	it("instance", () => {
		const model = { tagName: "div" }
		const route = new Route("/test", model, Binding)
		assert.strictEqual(route.match, "/test")
		assert.deepEqual(route.model, model)
		assert.throws(function() {
			route.match = 1
			route.model = 1
			route.binding = 1
		})
	})

})
