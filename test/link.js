import { Binding } from "domodel"

import Link from "../src/object/link.js"

export function instance(test) {
	test.expect(4)
	const link = new Link("/a", { a: 12 })
	test.strictEqual(link.properties.a, 12)
	test.strictEqual(link.path, "/a")
	test.throws(function() {
		link.path = {}
		link.properties = {}
	})
	const link_ = new Link("/a")
	test.deepEqual(link_.properties, {})
	test.done()
}
