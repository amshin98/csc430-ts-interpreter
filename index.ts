class NumC {
   type = 'NumC' as const;
   constructor(public n: number) {}
}
class IdC {
   type = 'IdC' as const;
   constructor(public s: string) {}
}
// class IfC {
//     type = "IfC" as const
//     constructor(public tst: ExprC, public thn: ExprC, public els: ExprC) {}
// }
class AppC {
   type = 'AppC' as const;
   constructor(public func: ExprC, public args: ExprC[]) {}
}
class LamC {
   type = 'LamC' as const;
   constructor(public params: string[], public body: ExprC) {}
}
type ExprC = NumC | IdC | AppC | LamC; //| IfC

// Environment
interface HashTable<T> {
   [key: string]: T;
}

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

// Environment
function init_mt_env(): Map<string, Value> {
   var env = new Map<string, Value>();
   env.set('null', new StrV('null'));
   env.set('+', new PrimV(plus));
   return env;
}

function plus(left: Value, right: Value): Value {
   return new NumV((<NumV>left).n + (<NumV>right).n);
}

// extends the environment
function extend_env(new_env: Map<string, Value>, old_env: Map<string, Value>) {
   return new Map([...old_env, ...new_env]);
}

/*
 * Visitor TypeScript implementation of Racket's pattern matching
 * inspired by https://gist.github.com/pufface/6a2050b21a692d2400c35bbe3536552c
 */
type ExprCType = ExprC['type'];

type ExprCMap<U> = { [K in ExprCType]: U extends { type: K } ? U : never };
type ExprCTypeMap = ExprCMap<ExprC>;

type Pattern<T> = { [K in keyof ExprCTypeMap]: (expr: ExprCTypeMap[K]) => T };

function interp(env: Map<string, Value>): (expr: ExprC) => Value {
   const match: Pattern<Value> = {
      NumC: ({ n }) => new NumV(n),
      IdC: ({ s }) => <Value>env.get(s),
      AppC: ({ func, args }) => {
         const interpWithEnv = interp(env);
         const funcDefinition: Value = interpWithEnv(func);
         if (funcDefinition instanceof CloV) {
            const newEnv = new Map();
            funcDefinition.params.forEach((param, index) =>
               newEnv.set(param, interpWithEnv(args[index])),
            );
            return interp(extend_env(newEnv, funcDefinition.env))(
               funcDefinition.body,
            );
         } else if (funcDefinition instanceof PrimV) {
            const leftOp = interpWithEnv(args[0]);
            const rightOp = interpWithEnv(args[1]);
            return funcDefinition.op(leftOp, rightOp);
         } else {
            throw new Error('DUNQ: AppC was not a CloV or a PrimV');
         }
      },
      LamC: ({ params, body }) => new CloV(params, body, env),
   };

   return expr => match[expr.type](expr as any);
}

const topInterp = interp(init_mt_env());

export { NumC, IdC, AppC, LamC, Value, NumV, StrV };
export default topInterp;
