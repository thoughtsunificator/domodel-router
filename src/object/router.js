import { Observable } from "domodel"
import { Tokenizer, Token } from "@thoughtsunificator/route-tokenizer"

/**
 * @global
 */
class Router extends Observable {

	/**
	 * @property RouterType {RouterType}
	 * @property RouterType.VIRTUAL {string}
	 * @property RouterType.PATHNAME {string}
	 * @property RouterType.HASH {string}
	 */
	static TYPE = {
		VIRTUAL: "VIRTUAL",
		PATHNAME: "PATHNAME",
		HASH: "HASH"
	}

	/**
	 * @param {Route[]}    routes
	 * @param {RouterType} [type=Router.TYPE.VIRTUAL]
	 * @param {Route}      errorRoute
	 * @param {string}     initialPath
	 */
	constructor(routes, type = Router.TYPE.VIRTUAL, errorRoute, initialPath = "/") {
		super()
		this._routes = routes
		this._type = type
		this._errorRoute = errorRoute
		this._initialPath = initialPath
		this._view = null
	}

	/**
	 * @param  {string} path
	 * @return {Route}
	 */
	match(path) {
		const uriTokens = Tokenizer.tokenize(path)
		for (const route of this.routes) {
			const validTokens = []
			const routeTokens = Tokenizer.tokenize(route.match)
			if (routeTokens.length !== uriTokens.length) {
				continue
			}
			for (const [index, uriToken] of uriTokens.entries()) {
				if (routeTokens[index].buffer === uriToken.buffer ||
						routeTokens[index].type === Token.TYPE.SEPARATOR ||
						(routeTokens[index].type === Token.TYPE.PARAMETER && uriToken.type === Token.TYPE.PATH)) {
					validTokens.push(routeTokens[index])
				}
			}
			if (validTokens.length === uriTokens.length) {
				const parameters = {}
				for(const [index, token] of uriTokens.entries()) {
					if(routeTokens[index].type === Token.TYPE.PARAMETER && token.type === Token.TYPE.PATH) {
						parameters[routeTokens[index].buffer.slice(1, -1)] = decodeURIComponent(token.buffer)
					}
				}
				return {
					route,
					parameters
				}
			}
		}
		return null
	}

	/**
	 * @readonly
	 * @type {Route[]}
	 */
	get routes() {
		return this._routes
	}

	/**
	 * @readonly
	 * @type {RouterType}
	 */
	get type() {
		return this._type
	}

	/**
	 * @readonly
	 * @type {Route}
	 */
	get errorRoute() {
		return this._errorRoute
	}

	/**
	 * @readonly
	 * @type {string}
	 */
	get initialPath() {
		return this._initialPath
	}

	/**
	 * @type {View}
	 */
	get view() {
		return this._view
	}

	set view(view) {
		this._view = view
	}

}

export default Router
