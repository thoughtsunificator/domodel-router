import { Binding } from "domodel"

import View from "../src/object/view.js"

export function instance(test) {
	test.expect(4)
	const view = new View(Binding, { a: 1 })
	test.strictEqual(view.parameters.a, 1)
	test.throws(function() {
		view.parameters = {}
	})
	test.doesNotThrow(function() {
		view.binding = 1
	})
	const view_ = new View(Binding)
	test.deepEqual(view_.parameters, {})
	test.done()
}
