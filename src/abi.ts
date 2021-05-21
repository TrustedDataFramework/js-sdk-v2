import { JsonFragment, JsonFragmentType } from '@ethersproject/abi'
import authAbi = require('./contracts/Authentication.json')
import powAbi = require('./contracts/PoWBios.json')

export const POW_BIOS_ABI = powAbi

export const AUTHENTICATION_ABI = authAbi

export function compileRust(str: string): JsonFragment[] {
  let re = /#\[no_mangle\][\s\n\t]*pub[\s\n\t]+fn[\s\n\t]+([a-zA-Z_][a-zA-Z0-9_]*)[\s\n\t]*\(([a-z\n\s\tA-Z0-9_,:<>]*)\)[\s\n\t]*(->[\s\n\t]*.*)?{[\s\t]*(\/\/[\s\n\t]*@[a-z]+)?/g
  const ret = []
  const types = {
    u64: 'uint64',
    bool: 'bool',
    string: 'string',
    'Vec<u8>': 'bytes',
    Address: 'address',
    U256: 'uint256',
    String: 'string',
    'boolean': 'bool',
    'Vec<Vec<u8>>': 'bytes[]',
    'Vec<Address>': 'address[]',
  }   

  function getInputs(str: string): JsonFragmentType[] {
    const ret = []
    for(let p of str.split(',')) {
      if(!p) continue
      const lr = p.split(':')
      ret.push({
        name: lr[0].trim(),
        type: types[lr[1].trim()]
      })
    }

    return ret
  }

  function getOutputs(str: string): JsonFragmentType[] {
    for(let t of Object.keys(types)) {
      if (str && str.indexOf(t) >= 0) 
        return [{type: types[t]}]
    }
    return []
  }  

  function getStateMutability(str: string) {
    const stateMutabilities = ['payable', 'view', 'pure', 'nopayable']

    if (!str)
      return 'nonpayable'

    for (let x of stateMutabilities) {
      if (str.indexOf(x) >= 0)
        return x
    }
    return 'payable'
  }

  for (let m of str.match(re) || []) {
    re.lastIndex = 0
    const r = re.exec(m)
    if (r[1].startsWith('__'))
      continue
    let o = {
      name: r[1] === 'init' ?  '' : r[1],
      type: r[1] === 'init' ? 'constructor' : 'function',
      inputs: getInputs(r[2]),
      outputs: getOutputs(r[3]),
      stateMutability: getStateMutability(r[4]),
    }
    
    if (o.name === '') {
      delete o['name']
    }
    ret.push(o)
  }  

  return ret
}

