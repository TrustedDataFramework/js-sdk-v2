import { U256 }  from "./u256"

// @ts-ignore
@external("env", "_transfer")
// type, address, amount
declare function _transfer(type: u64, arg0: u64, arg1: u64): void;

export class Address {
    constructor(readonly buf: ArrayBuffer) {
    }

    transfer(amount: U256): void {
        const ptr = changetype<usize>(this)
        _transfer(0, ptr, changetype<usize>(amount))
    }
}