const path = require('path');
const webpack = require('webpack');
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
	plugins: [
		// remove warning 'Critical dependency: the request of a dependency is an expression'
		new webpack.ContextReplacementPlugin(/colors|keyv/)
	],
	// this makes sure we include node_modules and other 3rd party libraries
	externals: [/node_modules/, 'bufferutil', 'utf-8-validate'],
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	}
};
