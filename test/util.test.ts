import { pluckUndefinedObjectValues } from '../src/util';

describe('pluckUndefinedObjectValues', () => {
  test('removes undefined property values from object', () => {
    const object = {
      value: 1,
      undefinedValue: undefined
    };
    pluckUndefinedObjectValues(object);
    expect(object).toMatchObject({
      value: 1
    });
  });
});
