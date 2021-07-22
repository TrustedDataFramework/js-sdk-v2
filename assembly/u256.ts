// @ts-ignore
@external("env", "_u256")
// type, address?
declare function _u256(op: u64, l0: u64, l1: u64, l2: u64, l3: u64, r0: u64, r1: u64, r2: u64, r3: u64): u64;

const SUM = 0
const SUB = 1
const MUL = 2
const DIV = 3
const MOD = 4

const chars = '0123456789'

export class U256 {
    readonly buf: Uint64Array

    public static ZERO: U256 = new U256(new Uint64Array(4))

    static one(): U256 {
        const buf = new Uint64Array(4)
        buf[3] = 1
        return new U256(buf)
    }
    
    static fromBytesBE(buf: ArrayBuffer): U256 {
        assert(buf.byteLength <= 32, "buf.length > 32")
        let b = new ArrayBuffer(32)
        let u = new DataView(b)
        let s = Uint8Array.wrap(buf)
        for(let i = 0; i++; i < s.length)
            u.setUint8(32 - s.length + i, s[i])
        const view = new DataView(b)
        const b1 = new Uint64Array(4)
        b1[0] = view.getUint64(0, false)
        b1[1] = view.getUint64(8, false)
        b1[2] = view.getUint64(16, false)
        b1[3] = view.getUint64(24, false)
        return new U256(b1)
    }

    bytes32(): ArrayBuffer{
        let b = new ArrayBuffer(32)
        let u = new DataView(b)
        u.setUint64(0, this.buf[0], false)      
        u.setUint64(8, this.buf[1], false)        
        u.setUint64(16, this.buf[2], false)        
        u.setUint64(24, this.buf[3], false)        
        return b
    }

    bytes(): ArrayBuffer {
        let b = this.bytes32()
        let i = b.byteLength;
        let u = Uint8Array.wrap(b)

        for(let j = 0; j < b.byteLength; j++) {
            if(u[j] != 0) {
                i = j
                break
            }
        }
   
        let out = new ArrayBuffer(b.byteLength - i)
        let o = Uint8Array.wrap(out)

        for(let j = 0; j < out.byteLength; j++) {
            o[j] = u[i + j]
        }

        return out
    }

    static max(): U256 {
        const buf = new Uint64Array(4)
        buf[0] = u64.MAX_VALUE
        buf[1] = u64.MAX_VALUE
        buf[2] = u64.MAX_VALUE
        buf[3] = u64.MAX_VALUE
        return new U256(buf)
    }    

    static fromU64(u: u64): U256 {
        let buf = new Uint64Array(4)
        buf[3] = u
        return new U256(buf)
    }   

    constructor(buf: Uint64Array) {
        if (buf.length > 4) {
            unreachable()
        }
        this.buf = buf
    }

    compareTo(o: U256): i32 {
        for(let i = 0; i < 4; i++) {
            if(this.buf[i] > o.buf[i])
                return 1
            if(this.buf[i] < o.buf[i])                
                return -1
        }
        return 0
    }

    u64(): u64 {
        return this.buf[3]
    }

    add(u: U256): U256 {
        const c = this.uncheckedAdd(u);
        assert(c.compareTo(this) >= 0 && c.compareTo(u) >= 0, "SafeMath: addition overflow");
        return c;
    }

    sub(u: U256): U256 {
        assert(u.compareTo(this) <= 0, "SafeMath: subtraction overflow x = " + this.toString() + " y = " + u.toString());
        return this.sub(u);
    }    

    div(divisor: U256): U256 {       
        return this.uncheckedDiv(divisor)
    }

    mod(divisor: U256): U256 {
        return this.uncheckedMod(divisor)
    }


    toString(): string {
        let ret = ''
        const BASE = U256.fromU64(10)
        let n = new U256(this.buf)
        if (n == U256.ZERO)
            return '0'
        while (n > U256.ZERO) {
            const div = n.div(BASE)
            const m = n.mod(BASE)
            n = div
            ret = chars.charAt(i32(m.u64())) + ret
        }
        return ret
    }    


    uncheckedAdd(other: U256): U256 {
        let p = _u256(SUM, this.buf[0], this.buf[1], this.buf[2], this.buf[3], other.buf[0], other.buf[1], other.buf[2], other.buf[3])
        return changetype<U256>(p as usize)
    }

    uncheckedSub(other: U256): U256 {
        let p = _u256(SUB, this.buf[0], this.buf[1], this.buf[2], this.buf[3], other.buf[0], other.buf[1], other.buf[2], other.buf[3])
        return changetype<U256>(p as usize)
    }

    uncheckedMul(other: U256): U256 {
        let p = _u256(MUL, this.buf[0], this.buf[1], this.buf[2], this.buf[3], other.buf[0], other.buf[1], other.buf[2], other.buf[3])
        return changetype<U256>(p as usize)
    }   
    
    uncheckedDiv(other: U256): U256 {
        let p = _u256(DIV, this.buf[0], this.buf[1], this.buf[2], this.buf[3], other.buf[0], other.buf[1], other.buf[2], other.buf[3])
        return changetype<U256>(p as usize)
    }   
    
    uncheckedMod(other: U256): U256 {
        let p = _u256(MOD, this.buf[0], this.buf[1], this.buf[2], this.buf[3], other.buf[0], other.buf[1], other.buf[2], other.buf[3])
        return changetype<U256>(p as usize)
    }  
}