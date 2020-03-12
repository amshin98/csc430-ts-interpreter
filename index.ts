class NumC {
    type = "NumC" as const
    constructor(public n: number) {}
  }
// class StrC {
//     type = "StrC" as const
//     constructor(public str: string) {}
// }
// class BoolC {
//     type = "BoolC" as const
//     constructor(public bool: Boolean) {}
// }
class IdC {
    type = "IdC" as const
    constructor(public s: number) {}
}
// class IfC {
//     type = "IfC" as const
//     constructor(public tst: ExprC, public thn: ExprC, public els: ExprC) {}
// }
// class AppC {
//     type = "AppC" as const
//     constructor(public func: ExprC, public arg: ExprC[]) {}
// }
// class LamC {
//     type = "LamC" as const
//     constructor(public params: symbol[], public body: ExprC) {}
// }

// Environment
interface HashTable<T> {
  [key : string] : T;
}

function init_mt_env() {
  var env: HashTable<number> = {}
  env["false"] = 1;
  env["+"] = 1;
  env["*"] = 1;
  env["-"] = 1;
  env["/"] = 1;
  env["<="] = 1;
  env["equal?"] = 1;
}

type ExprC = NumC | IdC//| StrC | BoolC | IdC | IfC | AppC | LamC
type ExprCType = ExprC["type"]

type ExprCMap<U> = { [K in ExprCType]: U extends { type: K } ? U : never }
type ExprCTypeMap = ExprCMap<ExprC>

type Pattern<T> = { [K in keyof ExprCTypeMap]: (expr: ExprCTypeMap[K]) => T }

function match<T>(pattern: Pattern<T>): (expr: ExprC) => T {
  // https://github.com/Microsoft/TypeScript/issues/14107
  return expr => pattern[expr.type](expr as any)
}

const exprs = [new NumC(3), new NumC(5)]

const interp = match<number>({
  NumC: ({n}) => n,
  IdC: ({s}) => s,
})

console.log(interp(new IdC(123)));
