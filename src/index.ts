export * from './abi'
import { JsonFragment } from '@ethersproject/abi'
import { utils, BytesLike } from 'ethers'

export const POW_BIOS_ADDRESS = '0x0000000000000000000000000000000000000002'
export const POA_AUTH_ADDRESS = "0x0000000000000000000000000000000000000004";
export const POS_ADDRESS = "0x0000000000000000000000000000000000000005";
export const FARMBASE_GATEWAY_ADDRESS = "0x0000000000000000000000000000000000000006"

// inline abi and constructor arguments into webassembly bytecode
export function inline(code: utils.BytesLike, abi: string | JsonFragment[], args?: any[]): BytesLike {
    const { link } = require("../linker/nodejs")
    

    if (!utils.isBytesLike(code)) {
        throw new Error('inline failed: code is not bytes like')
    }
    
    // new abi.Interface here to validate abi
    if (typeof abi !== 'string')
        abi = JSON.stringify(abi, null, 0)    

    let encoder = new utils.Interface(<any> abi)

    // when args provided, constructor should exists
    if(args && !encoder.functions['constructor']) {
        throw new Error('constructor not found ')
    }

    // when update code, no needs to link init code
    let encoded = 
        args?
        encoder.encodeDeploy(args):
        'NULL'

    // link abi & init code as custom section into module
    return '0x' + link(utils.hexlify(code), <any> abi, encoded)
}