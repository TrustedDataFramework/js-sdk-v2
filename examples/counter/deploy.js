// compile abi
const fs = require('fs')
const { compileAssemblyScript, inline } = require('../../dist')
const { providers, Wallet } = require('ethers')

const path = require('path')

// read content and compile abi
const content = fs.readFileSync(
    path.join(__dirname, 'assembly', 'index.ts'),
    'utf-8'
)

const abi = compileAssemblyScript(content)
const bin = fs.readFileSync(path.join(__dirname, 'bin', 'counter.wasm'))

// set constructor arguments
const inlined = inline('0x' + bin.toString('hex'), abi, ["hello world"])


// create transaction
const p = new providers.JsonRpcProvider('http://localhost:7010')
const w = new Wallet(process.env.PRIVATE_KEY, p)


// deploy and wait for transaction receipt
async function deploy() {
    const toWait = await w.sendTransaction({data : inlined})
    console.log(await toWait.wait())
}

deploy().catch(console.error)




