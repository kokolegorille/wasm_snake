const path = require("path")
const HTMLWebpackPlugin = require("html-webpack-plugin")
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin")

module.exports = {
    entry: {
        bundle: "./src/index.js"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "js/[name].js",
        publicPath: ""
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: "./src/index.html"
        }),
        new WasmPackPlugin({
            crateDirectory: path.resolve(__dirname, "./src/wasm/snake")
        })
    ],
    experiments: {
        asyncWebAssembly: true
    },
    devServer: {
        static: path.join(__dirname, "dist"),
        historyApiFallback: true,
        compress: true,
        open: true,
        // port: 8080,
    }
}