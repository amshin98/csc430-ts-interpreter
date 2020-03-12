import interp, { NumC } from './index';

describe('1-depth exprC tests', function() {
   it('NumC', function() {
      const result: number = interp(new NumC(123));
      expect(result).toBe(123);
   });
});
