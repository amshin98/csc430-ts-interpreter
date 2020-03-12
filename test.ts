import topInterp, { AppC, IdC, NumC, LamC, Value, NumV, StrV } from './index';

describe('1-depth exprC tests', function() {
   it('NumC', function() {
      const result: Value = topInterp(new NumC(123));
      expect(result).toEqual(new NumV(123));
   });
   it('IdC', function() {
      const result: Value = topInterp(new IdC('null'));
      expect(result).toEqual(new StrV('null'));
   });
});

describe('complex exprC tests', function() {
   it('AppC: PrimV to add 3 and 5', function() {
      // (+ 3 5)
      const result: Value = topInterp(
         new AppC(new IdC('+'), [new NumC(3), new NumC(5)]),
      );
      expect(result).toEqual(new NumV(8));
   });
   it('AppC: CloV to add 3 and 5', function() {
      // ((lam (x y) (+ x y)) 10 -5)
      const result: Value = topInterp(
         new AppC(
            new LamC(
               ['x', 'y'],
               new AppC(new IdC('+'), [new IdC('x'), new IdC('y')]),
            ),
            [new NumC(10), new NumC(-5)],
         ),
      );
      expect(result).toEqual(new NumV(5));
   });
});
