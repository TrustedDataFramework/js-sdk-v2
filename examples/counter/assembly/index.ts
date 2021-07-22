export { __malloc, __malloc_256, __malloc_512, __change_t, __peek } from '../../../assembly'

import { log, Bytes32 } from '../../../assembly'

export function init(m: string): void { 
    log(m)
}

export function sm3(input: ArrayBuffer): Bytes32 { // @pure
    return new ArrayBuffer(0)
}