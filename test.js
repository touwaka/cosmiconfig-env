const cosmiconfigEnv = require('./dist/CosmiconfigEnv').default

const explorer = cosmiconfigEnv('jakalana', {
	ENV: 'web'
})

explorer.search().then(({ config }) => {
	console.log(JSON.stringify(config, null, 4))
})