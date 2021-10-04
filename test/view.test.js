import assert from "assert"
import { Observable } from "domodel"

import View from "../src/object/view.js"

describe("view", () => {

	it("instance", () => {
		const view = new View({ a: 1 })
		assert.strictEqual(view.parameters.a, 1)
		assert.ok(View.prototype instanceof Observable)
		assert.throws(function() {
			view.parameters = {}
		})
	})

})
