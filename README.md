# cosmiconfig-env

Cosmiconfig searches for and loads configuration for your program. and merge env configuration to the base by env.

## Usage

```js
import cosmiconfigEnv from 'cosmiconfig-env'

const explorer = cosmiconfigEnv('jakalana', {
	ENV: 'web',
	// multi: true, //optional, support yaml multi-document sources
	// namePlace: '${moduleName}_${ENV}' //optional, custom env config moduleName

})

explorer.search().then(({ config }) => {
	console.log(JSON.stringify(config, null, 4))
})
```