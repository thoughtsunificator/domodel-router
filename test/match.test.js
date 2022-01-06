import assert from "assert"
import { Binding, Model } from "domodel"
import { Match, Route } from "../index.js"

const MyModel = {
	tagName: "div"
}

describe("match", () => {

	it("instance", () => {
		const route = new Route({
			match: "/test/{a}/{b}",
			model: new Model(MyModel)
		})
		const match = new Match(route, { a: "1cxz2", b: "dsadsa" })
		assert.strictEqual(match.route, route)
		assert.strictEqual(match.parameters.a, "1cxz2")
		assert.strictEqual(match.parameters.b, "dsadsa")
		assert.throws(function() {
			match.route = {}
			match.parameters = {}
		})
	})

})
