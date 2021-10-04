import assert from "assert"
import { JSDOM } from "jsdom"
import { Core, Binding } from "domodel"

import { LinkModel, LinkBinding, Router, Link }  from "../index.js"

const URL = "https://localhost/"

const routes = []

const virtualDOM = new JSDOM(``, { url: URL, })
const window = virtualDOM.window
const { document } = window

const RootModel = { tagName: "div" }
let rootBinding

describe("link.binding", () => {

	beforeEach(() => {
		rootBinding = new Binding()
		Core.run(RootModel, { parentNode: document.body, binding: rootBinding })
	})

	afterEach(() => {
		rootBinding.remove()
	})

	it("instance", () => {
		assert.ok(LinkBinding.prototype instanceof Binding)
	})

	it("onCreatedVirtual", () => {
		const link = new Link("/test1")
		const router = new Router(routes, Router.TYPE.VIRTUAL)
		const binding = new LinkBinding({ link, router })
		rootBinding.run(LinkModel(), { binding })
		assert.strictEqual(binding.root.href, "")
	})

	it("onCreatedPathName", () => {
		const link = new Link("/test2")
		const router = new Router(routes, Router.TYPE.PATHNAME)
		const binding = new LinkBinding({ link, router })
		rootBinding.run(LinkModel(), { binding })
		assert.strictEqual(binding.root.href, "https://localhost/test2")
	})

	it("onCreatedHash", () => {
		const link = new Link("/test3")
		const router = new Router(routes, Router.TYPE.HASH)
		const binding = new LinkBinding({ link, router })
		rootBinding.run(LinkModel(), { binding })
		assert.strictEqual(binding.root.href, "https://localhost/#/test3")
	})

	it("clickVirtual", (done) => {
		const router = new Router(routes, Router.TYPE.VIRTUAL)
		rootBinding.listen(router, "browse", link => {
			assert.strictEqual(link.path, "/virtual")
			done()
		})
		const link = new Link("/virtual")
		const binding = new LinkBinding({ link, router })
		rootBinding.run(LinkModel(), { binding })
		binding.root.dispatchEvent(new window.Event('click'))
	})

	it("clickPathName", (done) => {
		const router = new Router(routes, Router.TYPE.PATHNAME)
		rootBinding.listen(router, "navigate", link => {
			assert.strictEqual(link.path, "/pathname")
			done()
		})
		const link = new Link("/pathname")
		const binding = new LinkBinding({ link, router })
		rootBinding.run(LinkModel(), { binding })
		binding.root.dispatchEvent(new window.Event('click'))
	})

	it("clickHash", (done) => {
		const router = new Router(routes, Router.TYPE.HASH)
		rootBinding.listen(router, "navigate", link => {
			assert.strictEqual(link.path, "/hash")
			done()
		})
		const link = new Link("/hash")
		const binding = new LinkBinding({ link, router })
		rootBinding.run(LinkModel(), { binding })
		binding.root.dispatchEvent(new window.Event('click'))
	})

})
