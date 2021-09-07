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

export function setUp(callback) {
	rootBinding = new Binding()
	Core.run(RootModel, { parentNode: document.body, binding: rootBinding })
	callback()
}

export function tearDown(callback) {
	rootBinding.remove()
	callback()
}

export function instance(test) {
	test.expect(1)
	test.ok(new LinkBinding() instanceof Binding)
	test.done()
}

export function onCreatedVirtual(test) {
	test.expect(1)
	const link = new Link("/test1")
	const router = new Router(routes, Router.TYPE.VIRTUAL)
	const binding = new LinkBinding({ link, router })
	rootBinding.run(LinkModel(), { binding })
	test.strictEqual(binding.root.href, "")
	test.done()
}

export function onCreatedPathName(test) {
	test.expect(1)
	const link = new Link("/test2")
	const router = new Router(routes, Router.TYPE.PATHNAME)
	const binding = new LinkBinding({ link, router })
	rootBinding.run(LinkModel(), { binding })
	test.strictEqual(binding.root.href, "https://localhost/test2")
	test.done()
}

export function onCreatedHash(test) {
	test.expect(1)
	const link = new Link("/test3")
	const router = new Router(routes, Router.TYPE.HASH)
	const binding = new LinkBinding({ link, router })
	rootBinding.run(LinkModel(), { binding })
	test.strictEqual(binding.root.href, "https://localhost/#/test3")
	test.done()
}

export function clickVirtual(test) {
	test.expect(1)
	const router = new Router(routes, Router.TYPE.VIRTUAL)
	rootBinding.listen(router, "browse", link => {
		test.strictEqual(link.path, "/virtual")
		test.done()
	})
	const link = new Link("/virtual")
	const binding = new LinkBinding({ link, router })
	rootBinding.run(LinkModel(), { binding })
	binding.root.dispatchEvent(new window.Event('click'))
}

export function clickPathName(test) {
	test.expect(1)
	const router = new Router(routes, Router.TYPE.PATHNAME)
	rootBinding.listen(router, "navigate", link => {
		test.strictEqual(link.path, "/pathname")
		test.done()
	})
	const link = new Link("/pathname")
	const binding = new LinkBinding({ link, router })
	rootBinding.run(LinkModel(), { binding })
	binding.root.dispatchEvent(new window.Event('click'))
}

export function clickHash(test) {
	test.expect(1)
	const router = new Router(routes, Router.TYPE.HASH)
	rootBinding.listen(router, "navigate", link => {
		test.strictEqual(link.path, "/hash")
		test.done()
	})
	const link = new Link("/hash")
	const binding = new LinkBinding({ link, router })
	rootBinding.run(LinkModel(), { binding })
	binding.root.dispatchEvent(new window.Event('click'))
}
