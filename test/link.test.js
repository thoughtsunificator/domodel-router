import assert from "assert"
import { Link } from "../index.js"

describe("link", () => {

	it("instance", () => {
		const link = new Link("/a", { a: 12 })
		assert.strictEqual(link.properties.a, 12)
		assert.strictEqual(link.path, "/a")
		assert.throws(function() {
			link.path = {}
			link.properties = {}
		})
		const link_ = new Link("/a")
		assert.deepEqual(link_.properties, {})
	})

})
