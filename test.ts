import interp, { IdC, NumC, Value, NumV, StrV } from './index';

describe('1-depth exprC tests', function() {
   it('NumC', function() {
      const result: Value = interp(new NumC(123));
      expect(result).toEqual(new NumV(123));
   });
   it('IdC', function() {
      const result: Value = interp(new IdC('null'));
      expect(result).toEqual(new StrV('null'));
   });
});
