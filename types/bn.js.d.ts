declare module 'bn.js' {
  // ---------------------------- bn.js module types
  export interface BNObject {
    length: number;
    negative: number;
    red: Red;
    words: number[];

    _countBits(w: number): number;
    _expand(size: number): BNObject;
    _forceRed(ctx: BNObject): BNObject;
    _iaddn(num: number): BNObject;
    _init(number: number | string | string[], base: number | string, endian: string): BNObject;
    _initArray(number: number[], base: number, endian: string): BNObject;
    _initNumber(number: number, base: number, endian: string): BNObject;
    _invmp(p: BNObject): BNObject;
    _ishlnsubmul(num: BNObject, mul: number, shift: number): BNObject;
    _normSign(): BNObject;
    _parseBase(number: BNObject, base: number, start: number): BNObject;
    _parseHex(number: BNObject, start: number): BNObject;
    _wordDiv(num: BNObject, mode: string): DivModObj;
    _zeroBits(w: number): number;
    abs(): BNObject;
    add(num: BNObject): BNObject;
    addn(num: number): BNObject;
    and(num: BNObject): BNObject;
    andln(num: number): number;
    bincn(bit: number): BNObject;
    bitLength(): number;
    byteLength(): number;
    clone(): BNObject;
    cmp(num: BNObject): number;
    cmpn(num: BNObject): number;
    copy(dest: BNObject): void;
    div(num: BNObject): BNObject;
    divRound(num: BNObject): BNObject;
    divmod(num: BNObject, mode?: string, positive?: boolean): DivModObj;
    divn(num: number): BNObject;
    egcd(p: BNObject): BNObject;
    eq(num: BNObject): boolean;
    eqn(num: BNObject): boolean;
    forceRed(ctx: BNObject): BNObject;
    fromRed(): BNObject;
    fromTwos(width: number): BNObject;
    gcd(p: BNObject): Object;
    gt(num: BNObject): boolean;
    gte(num: BNObject): boolean;
    gten(num: BNObject): boolean;
    gtn(num: BNObject): boolean;
    iabs(): BNObject;
    iadd(num: BNObject): BNObject;
    iaddn(num: number): BNObject;
    iand(num: BNObject): BNObject;
    idivn(num: number): BNObject;
    imaskn(bits: number): BNObject;
    imul(num: BNObject): BNObject;
    imuln(num: number): BNObject;
    ineg(): BNObject;
    inotn(width: number): BNObject;
    inspect(): string;
    invm(num: BNObject): BNObject;
    ior(num: BNObject): BNObject;
    isEven(): boolean;
    isNeg(): boolean;
    isOdd(): boolean;
    isZero(): boolean;
    ishln(bits: number): BNObject;
    ishrn(bits: number, hint?: number, extended?: boolean): BNObject;
    isqr(): BNObject;
    isub(num: BNObject): BNObject;
    isubn(num: number): BNObject;
    iuand(num: BNObject): BNObject;
    iuor(num: BNObject): BNObject;
    iushln(bits: number): BNObject;
    iushrn(bits: number, hint?: number, extended?: boolean): BNObject;
    iuxor(num: BNObject): BNObject;
    ixor(num: BNObject): BNObject;
    lt(num: BNObject): boolean;
    lte(num: BNObject): boolean;
    lten(num: BNObject): boolean;
    ltn(num: BNObject): boolean;
    maskn(bits: number): BNObject;
    mod(num: BNObject): BNObject;
    modn(num: number): BNObject;
    mul(num: BNObject): BNObject;
    mulTo(num: BNObject, out: BNObject): BNObject;
    mulf(num: BNObject): BNObject;
    muln(num: number): BNObject;
    neg(): BNObject;
    notn(width: number): BNObject;
    or(num: BNObject): BNObject;
    pow(num: BNObject): BNObject;
    redAdd(num: BNObject): BNObject;
    redIAdd(num: BNObject): BNObject;
    redIMul(num: BNObject): BNObject;
    redISqr(): BNObject;
    redISub(num: BNObject): BNObject;
    redInvm(): BNObject;
    redMul(num: BNObject): BNObject;
    redNeg(): BNObject;
    redPow(num: BNObject): BNObject;
    redShl(num: number): BNObject;
    redSqr(): BNObject;
    redSqrt(): BNObject;
    redSub(num: BNObject): BNObject;
    setn(bit: number, val: boolean): BNObject;
    shln(bits: number): BNObject;
    shrn(bits: number): BNObject;
    sqr(a: BNObject): BNObject;
    strip(): BNObject;
    sub(num: BNObject): BNObject;
    subn(num: number): BNObject;
    testn(bit: number): boolean;
    toArray(endian: string, length?: number): number[];
    toBuffer(endian: string, length?: number): any;
    toJSON(): string;
    toNumber(): number;
    toRed(ctx: BNObject): BNObject;
    toString(base?: number | string, padding?: number): string;
    toTwos(width: number): BNObject;
    uand(num: BNObject): BNObject;
    ucmp(num: BNObject): number;
    umod(num: BNObject): BNObject;
    uor(num: BNObject): BNObject;
    ushln(bits: number): BNObject;
    ushrn(bits: number): BNObject;
    uxor(num: BNObject): BNObject;
    xor(num: BNObject): BNObject;
    zeroBits(): number;
  }
  export interface DivModObj {
    div: BNObject;
    mod: BNObject;
  }
  export interface MPrime {
    name: string;
    p: BNObject;
    n: number;
    k: BNObject;
    tmp: BNObject;

    ireduce(num: BNObject): BNObject;
    split(input: BNObject, output: boolean): BNObject;
    imulK(num: BNObject): BNObject;
  }
  export interface Red {
    m: BNObject;
    prime: MPrime;

    imod(a: BNObject): BNObject;
    neg(a: BNObject): BNObject;
    add(a: BNObject, b: BNObject): BNObject;
    iadd(a: BNObject, b: BNObject): BNObject;
    sub(a: BNObject, b: BNObject): BNObject;
    isub(a: BNObject, b: BNObject): BNObject;
    shl(a: BNObject, num: number): BNObject;
    imul(a: BNObject, b: BNObject): BNObject;
    mul(a: BNObject, b: BNObject): BNObject;
    isqr(a: BNObject): BNObject;
    sqr(a: BNObject): BNObject;
    sqrt(a: BNObject): BNObject;
    invm(a: BNObject): BNObject;
    pow(a: BNObject, num: BNObject): BNObject;
    convertTo(num: BNObject): BNObject;
    convertFrom(num: BNObject): BNObject;
  }
  export interface Mont extends Red {
    shift: number;
    r: BNObject;
    r2: BNObject;
    rinv: BNObject;
    minv: BNObject;
  }

  export type Endianness = 'le' | 'be'

  export interface Constructor {
    new(number: number | string | number[] | Buffer, base?: number, endian?: Endianness): BNObject
  }

  export const BN: Constructor
}