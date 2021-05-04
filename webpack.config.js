const path = require("path")
const webpack = require('webpack')

module.exports = (env = {}) => {
    let config = {
        mode: 'production',
        devtool: 'source-map',
        entry: path.join(__dirname, "src/index.ts"),
        output: {
            path: path.join(__dirname, "dist"),
            filename: `bundle.web.js`,
            library: "tdos",
            libraryTarget: "umd",
        },
        resolve: {
            // Add `.ts` and `.tsx` as a resolvable extension.
            extensions: [".ts", ".tsx", ".js"],
        },
        module: {
            rules: [
                // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader",
                    options: { transpileOnly: true },
                    exclude: /node_modules/,
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: "babel-loader",
                },
            ],
        },
        externals: {
            '../linker/nodejs': 'tdos_linker',
            'ethers': 'ethers'
        }        
    }
    return config
}
