const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require("webpack");
const resolve = dir => path.resolve(__dirname, dir);

const config = {
	entry: {
		// where webpack starts to build the bundle. All other deps are imported from here.
		app: resolve("./src/main.js"),
		vendor: ['phaser']
	},
	output: {
		filename: '[name].[hash].js',
		path: resolve("dist")
	},
	plugins: [
		new HtmlWebpackPlugin({
			hash: true,
			template: "./src/index.html",
			filename: "index.html", //relative to root of the application
		}),
		new CopyWebpackPlugin([
			{ from: "assets", to: "assets" },
		]),
	],
	optimization: {
		splitChunks: {
			name: 'vendor',
			chunks: 'all'
		}
	},

	devServer: {
		/** following two lines allow (less-secure) access from the Local network. */
		disableHostCheck: true,
		host: "0.0.0.0"
	}
};

module.exports = (env, argv) => {
	if (argv.mode === 'development') {
		// note that by default, development mode uses evil eval.
		// we must set the devtool explicitly to change this.
		config.devtool = 'inline-source-map';
	}
	if (argv.mode === 'production') {
		// do not enable source-map
	}
	return config;
};
