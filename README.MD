for webpack user, add following to your webpack.config.js
```js
{
    externals: {
        '../linker/nodejs': 'tdos_linker',
        'ethers': 'ethers'
    }   
}
  
```