import topInterp, {
   NumC,
   AppC,
   IdC,
   LamC,
   IfC,
   Value,
   NumV,
   StrV,
   BoolV,
} from './index';

describe('1-depth exprC tests', function() {
   it('NumC', function() {
      const result: Value = topInterp(new NumC(123));
      expect(result).toEqual(new NumV(123));
   });
   it('IdC', function() {
      const result: Value = topInterp(new IdC('null'));
      expect(result).toEqual(new StrV('null'));
   });
   it('IfC', function() {
      const result: Value = topInterp(
         new IfC(
            new AppC(new IdC('<='), [new NumC(50), new NumC(5)]),
            new NumC(1),
            new NumC(0),
         ),
      );
      expect(result).toEqual(new NumV(0));
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
   it('AppC: CloV to verify env extension', function() {
      // ((lam (x) (lam () x)) 10)
      const result: Value = topInterp(
         new AppC(new LamC(['x'], new AppC(new LamC([], new IdC('x')), [])), [
            new NumC(10),
         ]),
      );
      expect(result).toEqual(new NumV(10));
   });
   it('AppC: CloV w/ PrimV', function() {
      // ((lam (x) (lam () (+ x 1))) 10)
      const result: Value = topInterp(
         new AppC(
            new LamC(
               ['x'],
               new AppC(
                  new LamC(
                     [],
                     new AppC(new IdC('+'), [new IdC('x'), new NumC(1)]),
                  ),
                  [],
               ),
            ),
            [new NumC(10)],
         ),
      );
      expect(result).toEqual(new NumV(11));
   });
});
