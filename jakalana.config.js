
const CWD = process.cwd()

module.exports = {
	entry: {
		index: './web/index'
	},
	output: {
		path: CWD + '/web/dist'
	},
	resolve: {
	    alias: {
	      'react-native$': 'react-native-web'
	    }
  	},
	module: {
		rules: [{
			test: /\.m?js$/i,
			loader: 'babel-loader'
		}]
	} 
}