import { JsonFragment, JsonFragmentType } from '@ethersproject/abi'
import authAbi = require('./contracts/Authentication.json')
import powAbi = require('./contracts/PoWBios.json')

export const POW_BIOS_ABI = powAbi

export const AUTHENTICATION_ABI = authAbi

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

/**
 * 编译生成 abi JSON 文件
 * @param str 源代码文件的字符串
 */
 export function compileAssemblyScript(str: string): JsonFragment[] {
  const types = {
    u64: 'uint64',
    bool: 'bool',
    string: 'string',
    'ArrayBuffer': 'bytes',
    Address: 'address',
    U256: 'uint256',
    String: 'string',
    'boolean': 'bool',
    'Vec<Vec<u8>>': 'bytes[]',
    'Vec<Address>': 'address[]',
    'Bytes32': 'bytes32',
  }   

  function getOutputs(str: string): JsonFragmentType[] {
    if (str === 'void') return []
    const ret = types[str]
    if (!ret) throw new Error(`invalid type: ${str}`)
    return [{
      type: ret
    }]
  }

  function getInputs(str): JsonFragmentType[] {
    const ret = []
    for (let p of str.split(',')) {
      if (!p) continue
      const lr = p.split(':')
      let l = lr[0].trim()
      const r = lr[1].trim()
      if (!types[r]) throw new Error(`invalid type: ${r}`)
      ret.push({
        name: l,
        type: types[r]
      })
    }
    return ret
  }

  const ret = []
  let funRe = /export[\s\n\t]+function[\s\n\t]+([a-zA-Z_][a-zA-Z0-9_]*)[\s\n\t]*\(([a-z\n\s\tA-Z0-9_,:]*)\)[\s\n\t]*:[\s\n\t]*([a-zA-Z_][a-zA-Z0-9_]*)[\s\n\t]*{[\s\t]*(\/\/[\s\n\t]*@[a-z]+)?/g

  for (let m of str.match(funRe) || []) {
    funRe.lastIndex = 0
    const r = funRe.exec(m)
    if (r[1].startsWith('__')) continue

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
    'Bytes32': 'bytes32',
  }   

  function getInputs(str: string): JsonFragmentType[] {
    const r = []
    for(let p of str.split(',')) {
      if(!p) continue
      const lr = p.split(':')
      r.push({
        name: lr[0].trim(),
        type: types[lr[1].trim()]
      })
    }

    return r
  }

  function getOutputs(str: string): JsonFragmentType[] {
    for(let t of Object.keys(types)) {
      if (str && str.indexOf(t) >= 0) 
        return [{type: types[t]}]
    }
    return []
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

