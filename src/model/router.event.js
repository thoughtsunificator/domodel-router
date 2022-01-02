import { EventListener } from "domodel"
import Router from "../object/router.js"
import View from "../object/view.js"
import Match from "../object/match.js"
import Link from "../object/link.js"

/**
 * @global
 */
class RouterEventListener extends EventListener {

	/**
	 * @event RouterEventListener#navigate
	 * @property {Link} link
	 * @example router.emit("navigate", new Link("/path"))
	 */
	navigate(link) {
		let path = link.path
		if(this.properties.router.type === Router.TYPE.HASH) {
			path = `#${link.path}`
		}
		this.root.ownerDocument.defaultView.history.pushState({}, null, `${this.properties.router.basePath}${path}`)
		this.properties.router.emit("browse", link)
	}

	/**
	 * @event RouterEventListener#browse
	 * @property {Link} link
	 * @example router.emit("browse", new Link("/path"))
	 */
	browse(link) {
		const match = this.properties.router.match(link.path)
		if(match) {
			if(match.route.middleware && match.route.middleware(this.properties)) {
				return
			}
			this.properties.router.emit("routeSet", { match, link })
		} else {
			this.properties.router.emit("routeSet", { match: new Match(this.properties.router.errorRoute), link: new Link(link.path, { path: link.path }) })
		}
	}

	/**
	 * @event RouterEventListener#routeSet
	 * @property {object} data
	 * @property {Match}  data.match
	 * @property {Link}   data.link
	 * @example router.emit("routeSet", { match: new Match(...), link: new Link(...) })
	 */
	routeSet(data) {
		const { match, link } = data
		if(this.properties.router.view !== null) {
			if(this.layoutBinding) {
				this.layoutBinding.remove()
				this._layoutBinding = null
			} else {
				this.properties.router.view.binding.remove()
			}
		}
		this.properties.router._path = link.path
		this.properties.router._view = new View(match.parameters)
		this.properties.router.view.binding = new match.route.binding({ ...this.properties, ...match.route.properties, ...link.properties })
		let model = match.route.model(this.properties)
		let layoutBinding = this
		if(match.route.layout) {
			layoutBinding = new match.route.layout.binding()
			this.run(match.route.layout.model, { binding: layoutBinding })
		} else if(this.properties.router.defaultLayout) {
			layoutBinding = new this.properties.router.defaultLayout.binding()
			this.run(this.properties.router.defaultLayout.model, { binding: layoutBinding })
		}
		if(layoutBinding !== this) {
			this._layoutBinding = layoutBinding
		}
		layoutBinding.run(model, { parentNode: layoutBinding.identifier.view, binding: this.properties.router.view.binding })
	}

}

export default RouterEventListener
