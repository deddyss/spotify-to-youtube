const path = require('path');
const TSConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
	entry: './src/app.ts',
	target: 'node',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
		plugins: [
			new TSConfigPathsPlugin()
		]
	},
	// this makes sure we include node_modules and other 3rd party libraries
	externals: [/node_modules/, 'bufferutil', 'utf-8-validate'],
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	}
};
