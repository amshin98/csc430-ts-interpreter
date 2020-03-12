class NumC {
   type = 'NumC' as const;
   constructor(public n: number) {}
}
class IdC {
   type = 'IdC' as const;
   constructor(public s: string) {}
}
class IfC {
   type = 'IfC' as const;
   constructor(public cond: ExprC, public then: ExprC, public els: ExprC) {}
}
class AppC {
   type = 'AppC' as const;
   constructor(public func: ExprC, public args: ExprC[]) {}
}
class LamC {
   type = 'LamC' as const;
   constructor(public params: string[], public body: ExprC) {}
}
type ExprC = NumC | IdC | AppC | LamC | IfC;

// Values
class NumV {
   type = 'NumV' as const;
   constructor(public n: number) {}
}
class StrV {
   type = 'StrV' as const;
   constructor(public str: string) {}
}
class BoolV {
   type = 'BoolV' as const;
   constructor(public bool: boolean) {}
}
class CloV {
   type = 'CloV' as const;
   constructor(
      public params: string[],
      public body: ExprC,
      public env: Map<string, Value>,
   ) {}
}
class PrimV {
   type = 'PrimV' as const;
   constructor(public op: any) {}
}
type Value = NumV | StrV | BoolV | CloV | PrimV;

/*
 * Visitor TypeScript implementation of Racket's pattern matching
 * inspired by https://gist.github.com/pufface/6a2050b21a692d2400c35bbe3536552c
 */
type ExprCType = ExprC['type'];

type ExprCMap<U> = { [K in ExprCType]: U extends { type: K } ? U : never };
type ExprCTypeMap = ExprCMap<ExprC>;

type Pattern<T> = { [K in keyof ExprCTypeMap]: (expr: ExprCTypeMap[K]) => T };

function interp(expr: ExprC, env: Map<string, Value>): Value {
   const match: Pattern<Value> = {
      NumC: ({ n }) => new NumV(n),
      IdC: ({ s }) => <Value>env.get(s),
      LamC: ({ params, body }) => new CloV(params, body, env),
      IfC: ({ cond, then, els }) => {
         const condValue = interp(cond, env) as BoolV;

         return condValue.bool ? interp(then, env) : interp(els, env);
      },
      AppC: ({ func, args }) => {
         const fd: Value = interp(func, env);
         if (fd instanceof CloV) {
            const newEnv = new Map();
            fd.params.forEach((param: string, index: number) => {
               const arg: ExprC = args[index];
               newEnv.set(param, interp(arg, env));
            });

            return interp(fd.body, extendEnv(newEnv, fd.env));
         } else if (fd instanceof PrimV) {
            const leftOp = interp(args[0], env);
            const rightOp = interp(args[1], env);

            return fd.op(leftOp, rightOp);
         } else {
            throw new Error('DUNQ: AppC was not a CloV or a PrimV');
         }
      },
   };

   return match[expr.type](expr as any);
}

// Environment
function getBaseEnv(): Map<string, Value> {
   var env = new Map<string, Value>();
   env.set('null', new StrV('null'));
   env.set('+', new PrimV(plus));
   env.set('<=', new PrimV(lessThan));
   return env;
}

function plus(left: Value, right: Value): Value {
   return new NumV((<NumV>left).n + (<NumV>right).n);
}

function lessThan(left: Value, right: Value): Value {
   return new BoolV((<NumV>left).n <= (<NumV>right).n);
}

// extends the environment
function extendEnv(newEnv: Map<string, Value>, oldEnv: Map<string, Value>) {
   return new Map([...oldEnv, ...newEnv]);
}

const topInterp = (expr: ExprC) => interp(expr, getBaseEnv());

export { NumC, IdC, AppC, LamC, IfC, Value, NumV, StrV, BoolV };
export default topInterp;
