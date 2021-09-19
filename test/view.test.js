import assert from "assert"
import { Binding } from "domodel"

import View from "../src/object/view.js"

describe("view", () => {

	it("instance", () => {
		const view = new View(Binding, { a: 1 })
		assert.strictEqual(view.parameters.a, 1)
		assert.throws(function() {
			view.parameters = {}
		})
		assert.doesNotThrow(function() {
			view.binding = 1
		})
		const view_ = new View(Binding)
		assert.deepEqual(view_.parameters, {})
	})

})
