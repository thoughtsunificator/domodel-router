import { Binding } from "domodel"

import Route from "../src/object/route.js"

export function instance(test) {
	test.expect(4)
	const model = { tagName: "div" }
	const route = new Route("/test", model, Binding)
	test.strictEqual(route.match, "/test")
	test.deepEqual(route.model, model)
	test.ok(new route.binding() instanceof Binding)
	test.throws(function() {
		route.match = 1
		route.model = 1
		route.binding = 1
	})
	test.done()
}
