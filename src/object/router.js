import { Observable, Binding, Model } from "domodel"
import { Tokenizer, Token } from "@thoughtsunificator/route-tokenizer"

import Route from "./route.js"
import Match from "./match.js"

import ErrorModel from "../model/error.js"

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
	constructor({ routes, type = Router.TYPE.VIRTUAL, errorRoute, initialPath = "/", defaultLayout, basePath = "" } = {}) {
		super()
		this._routes = routes
		this._type = type
		this._errorRoute = errorRoute || new Route({
			model: new Model(ErrorModel)
		})
		this._initialPath = initialPath
		this._view = null
		this._path = null
		this._defaultLayout = defaultLayout
		this._basePath = basePath
	}

	/**
	 * @param  {string} path
	 * @return {Route}
	 */
	match(path) {
		const uriTokens = Tokenizer.tokenize(path)
		if(uriTokens[uriTokens.length - 1]?.buffer === "/") {
			uriTokens.pop()
		}
		for (const route of this.routes) {
			const validTokens = []
			const routeTokens = Tokenizer.tokenize(route.match)
			if(routeTokens[routeTokens.length - 1]?.buffer === "/") {
				routeTokens.pop()
			}
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
				return new Match(route, parameters)
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
	 * @readonly
	 * @type {View}
	 */
	get view() {
		return this._view
	}

	/**
	 * @readonly
	 * @type {type}
	 */
	get path() {
		return this._path
	}

	/**
	 * @readonly
	 * @type {Model}
	 */
	get defaultLayout() {
		return this._defaultLayout
	}

	/**
	 * @readonly
	 * @type {string}
	 */
	get basePath() {
		return this._basePath
	}

}

export default Router
