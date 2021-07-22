import { U256 } from "./u256"
import { Address } from "./address"

export * from "./u256"

export type Bytes32 = ArrayBuffer

// @ts-ignore
@external("env", "_log")
declare function _log(ptr: u64): void;

// @ts-ignore
export function log(a: string): void {
    _log(changetype<usize>(a))
}

export function __malloc(size: u64): u64 {
    const buf = new ArrayBuffer(i32(size))
    return changetype<usize>(buf)
}

export function __malloc_256(a0: u64, a1: u64, a2: u64, a3: u64): u64 {
    let buf = new Uint64Array(4)
    buf[0] = a0
    buf[1] = a1
    buf[2] = a2
    buf[3] = a3
    return changetype<usize>(new U256(buf))
}

export function __malloc_512(h0: u64, h1: u64, h2: u64, h3: u64, a0: u64, a1: u64, a2: u64, a3: u64): u64 {
    let buf = new Uint64Array(4)
    buf[0] = a0
    buf[1] = a1
    buf[2] = a2
    buf[3] = a3
    return changetype<usize>(new U256(buf))
}

export function __change_t(t: u64, ptr: u64, size: u64): u64 {
    const buf = changetype<ArrayBuffer>(usize(ptr))
    switch (t as u32) {
        case ADDRESS:
            return changetype<usize>(new Address(buf))
        case BYTES:
        case BYTES_32:
            return changetype<usize>(buf)
        case UINT_256:
            log("unexpected change type to uint_256")
            unreachable()
        case STRING:
            return changetype<usize>(String.UTF8.decode(buf))
    }
    return 0
}

export function __peek(ptr: u64, type: u64): u64 {
    switch (type as u32) {
        case STRING: {
            const str = changetype<string>(usize(ptr))
            const buf = String.UTF8.encode(str, false)
            return __peek(changetype<usize>(buf), BYTES)
        }
        case BYTES_32:
        case BYTES: {
            const buf = changetype<ArrayBuffer>(usize(ptr))
            let len = u64(buf.byteLength)
            return (ptr << 32) | len
        }
        case ADDRESS: {
            let addr = changetype<Address>(usize(ptr))
            return __peek(changetype<usize>(addr.buf), BYTES)
        }
        case UINT_256: {
            let u = changetype<U256>(usize(ptr))
            let bytes = u.bytes()
            return __peek(changetype<usize>(bytes), BYTES)
        }
    }
    return 0
}

const UINT_256: u32 = 0xec13d6d1 // keccak(uint256)
const ADDRESS: u32 = 0x421683f8 // keccak(address)
const STRING: u32 = 0x97fc4627 // keccak(string)
const BYTES: u32 = 0xb963e9b4 // keccak(bytes)
const BYTES_32: u32 = 0x9878dbb4 // keccak(bytes32)

export function abort(
    message: string | null,
    fileName: string | null,
    lineNumber: u32,
    columnNumber: u32
): void {
    if (message === null || fileName === null) return;
    // @ts-ignore
    log('ABORT: ' + message + ' - ' + fileName + ':' + lineNumber.toString())
    unreachable()
}

