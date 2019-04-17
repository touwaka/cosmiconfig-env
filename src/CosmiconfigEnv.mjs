import cosmiconfig from 'cosmiconfig'
import yaml from 'js-yaml'
import assign from './Assign'

function loadYaml(filepath, content) {
	return yaml.safeLoadAll(content, { filename: filepath })
}

function combineResult(results, multi, envs) {
	results = results.filter(result => result)
	if (results.length === 0) return null

	const filepath = []
	let configs = []
	let isEmpty = true
	results.forEach(result => {
		if (result) {
			result.config && (configs.push(result.config))
			filepath.push(result.filepath)
			isEmpty === true && result.isEmpty !== true && (isEmpty = false)
		}
	})

	multi && (configs = configs.map(config => {
		if (Array.isArray(config)) {
			if (config.length === 0) return {}
			let baseConfig = Object.assign({}, config[0])
			'ENV' in baseConfig && (baseConfig = {})
			for (const i = 1; i < config.length; i++) {
				const envConfig = config[i]
				envs.indexOf(envConfig.ENV) !== -1 && (baseConfig = assign(baseConfig, envConfig))
			}
			return baseConfig
		}
		return config
	}))

	return {
		config: assign(...configs),
		filepath, isEmpty
	}
}

function newExplorer(moduleName, cosmiconfigOptions, multi, ENV, namePlace) {
	const moduleNames = [moduleName]
	const envs = Array.isArray(ENV) ? ENV : ENV ? [ENV] : []
	namePlace || (namePlace = '${moduleName}_${ENV}')
	envs.forEach(env => {
		const envModuleName = namePlace.replace('${moduleName}', moduleName).replace('${ENV}', env)
		moduleNames.push(envModuleName)
	})
	const explorers = moduleNames.map(moduleName => cosmiconfig(moduleName, cosmiconfigOptions))
	return {
		search(...args) {
			return Promise.all(explorers.map(explorer => explorer.search(...args))).then(results => combineResult(results, multi, envs))
		},
		searchSync(...args) {
			return combineResult(explorers.map(explorer => explorer.searchSync(...args)), multi, envs)
		},
		load(...args) {
			return Promise.all(args.map(filepath => explorers[0].load(filepath))).then(results => combineResult(results, multi, envs))
		},
		loadSync(...args) {
			return combineResult(args.map(filepath => explorers[0].loadSync(filepath)), multi, envs)
		},
		clearLoadCache() {
			explorers[0].clearLoadCache()
		},
		clearSearchCache() {
			explorers.forEach(explorer => explorer.clearSearchCache())
		},
		clearCaches() {
			explorers.forEach(explorer => {
				explorer.clearLoadCache()
				explorer.clearSearchCache()
			})	
		}
	}
}

export default (moduleName, cosmiconfigOptions) => {
	const multi = cosmiconfigOptions.multi
	const ENV = cosmiconfigOptions.ENV
	const namePlace = cosmiconfigOptions.namePlace
	cosmiconfigOptions = Object.assign({}, cosmiconfigOptions)
	delete cosmiconfigOptions.multi
	delete cosmiconfigOptions.ENV
	delete cosmiconfigOptions.namePlace
	if (multi) {
		cosmiconfigOptions.loaders || (cosmiconfigOptions.loaders = {})
		Object.assign(cosmiconfigOptions.loaders, {
			'.yaml': loadYaml,
			'.yml': loadYaml
		})
	}
	return newExplorer(moduleName, cosmiconfigOptions, multi, ENV, namePlace)
}