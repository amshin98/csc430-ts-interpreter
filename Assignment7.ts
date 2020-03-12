class NumC {
    type = "NumC" as const
    constructor(public n: number) {}
  }
class StrC {
    type = "StrC" as const
    constructor(public str: string) {}
}
class BoolC {
    type = "BoolC" as const
    constructor(public bool: Boolean) {}
}
class IdC {
    type = "IdC" as const
    constructor(public s: Symbol) {}
}
class IfC {
    type = "IfC" as const
    constructor(public tst: ExprC, public thn: ExprC, public els: ExprC) {}
}
class AppC {
    type = "AppC" as const
    constructor(public func: ExprC, public arg: ExprC[]) {}
}
class LamC {
    type = "LamC" as const
    constructor(public params: symbol[], public body: ExprC) {}
}
  
type ExprC = NumC | StrC | BoolC | IdC | IfC | AppC | LamC
