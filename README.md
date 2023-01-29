# Wasm snake with Rust

Installation des dépendances de developpement.

```
npm i -D webpack webpack-cli webpack-dev-server
npm i -D @wasm-tool/wasm-pack-plugin html-webpack-plugin
```

## Additional packages

* wasmpack:      https://github.com/rustwasm/wasm-pack
* wasm-bindgen:  https://github.com/rustwasm/wasm-bindgen
* web-sys:       https://rustwasm.github.io/wasm-bindgen/web-sys/index.html

Voici le fichier Cargo.toml

```
[package]
name = "snake"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2.83"

[dependencies.web-sys]
version = "0.3.60"
features = ["console"]
```

## Webpack configuration

Il faut faire attention à outputDir quand les sources Rust ne sont pas à la racine!

```
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
            crateDirectory: path.resolve(__dirname, "./src/wasm/snake"),

            // The same as the `--out-dir` option for `wasm-pack`
            // outDir: "pkg",

            // Check issue...
            // https://github.com/wasm-tool/wasm-pack-plugin/issues/93
            outDir: path.resolve(__dirname, "./src/wasm/snake/pkg"),
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
```

D'autres options intéressantes pour le plugin wasmpack

```
extraArgs: '--no-typescript',
outName: "snake",
```

Ensuite, il est possible d'ajouter le package et de l'utiliser directement.

```
  "dependencies": {
    "snake": "file:./src/wasm/snake/pkg"
  },
```

## Index.js

Chargement du package, version longue...

```
async function init() {
    let rustApp = null
  
    try {
      rustApp = await import('./wasm/snake/pkg')
    } catch(err) {
      console.error(err)
      return;
    }
  
    console.log(rustApp)
    rustApp.hello()
}

init()
```

En utilisant le package

```
import { hello } from "snake"
hello()
```


## Wasm-pack

wasm-pack-plugin does not seems to produce the build for the web target.
There is no init function exported

But when using...

cd src/wasm/snake
wasm-pack build --target web

... it does

This is important when using wasm memory buffer

```
import init, { World, Direction, GameStatus } from "snake"
import { rnd } from "./wasm/snake/rnd"

init().then(wasm => {
    ...
    wasm.memory.buffer,
    ...
}
```

=> set extraArgs dans webpack config, wasm-pack plugin configuration

```
            extraArgs: '--target web',
```
