import assert from "assert"
import { Observable } from "domodel"
import { Layout } from "../index.js"

describe("link", () => {

	it("instance", () => {
		const layout = new Layout()
		assert.ok(Layout.prototype instanceof Observable)
	})

})
