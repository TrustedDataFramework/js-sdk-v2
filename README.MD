for webpack user, add following to your webpack.config.js
```js
{
    externals: {
        '../linker/nodejs': 'undefined'
    }   
}
  
```