import {
  assertJSONSchemaObject,
  ERR_SCHEMA_MUST_BE_OBJECT,
  ERR_SCHEMA_MUST_HAVE_PROPERTIES
} from '../src/schema';

describe('assertJSONSchemaObject', () => {
  test('throws if schema type not object', () => {
    expect(() => assertJSONSchemaObject({ type: 'null' })).toThrowError(
      ERR_SCHEMA_MUST_BE_OBJECT
    );
  });

  test('throws if properties property not present', () => {
    expect(() => assertJSONSchemaObject({ type: 'object' })).toThrowError(
      ERR_SCHEMA_MUST_HAVE_PROPERTIES
    );
  });

  test('throws if there are no property schemas specified', () => {
    expect(() =>
      assertJSONSchemaObject({ type: 'object', properties: {} })
    ).toThrowError(ERR_SCHEMA_MUST_HAVE_PROPERTIES);
  });

  test('assertion passes with valid json schema object with properties', () => {
    expect(() =>
      assertJSONSchemaObject({
        type: 'object',
        properties: { myNumber: { type: 'number' } }
      })
    ).not.toThrowError();
  });
});
