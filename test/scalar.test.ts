import {
  mustIndexableScalarType,
  DynamoDBIndexableScalarType,
  mustInferIndexableScalarType
} from '../src/scalar';

describe('mustIndexableScalarType', () => {
  test('throws error on invalid identifier', () => {
    expect(() => mustIndexableScalarType('invalid')).toThrowError(
      'Invalid DynamoDB indexable scalar type'
    );
  });

  test('maps "B" to Binary', () => {
    const res = mustIndexableScalarType('B');
    expect(res).toBe(DynamoDBIndexableScalarType.Binary);
  });

  test('maps "N" to Number', () => {
    const res = mustIndexableScalarType('N');
    expect(res).toBe(DynamoDBIndexableScalarType.Number);
  });

  test('maps "S" to String', () => {
    const res = mustIndexableScalarType('S');
    expect(res).toBe(DynamoDBIndexableScalarType.String);
  });
});

describe('mustInferIndexableScalarType', () => {
  test('throws error on non-indexable scalar type', () => {
    expect(() => mustInferIndexableScalarType({ type: 'object' })).toThrowError(
      `Cannot infer indexable scalar type from JSON Schema type 'object'`
    );
  });

  test('infers scalar type from "dynamoDBScalarType" property', () => {
    const type = mustInferIndexableScalarType({ dynamoDBScalarType: 'B' });
    expect(type).toBe(DynamoDBIndexableScalarType.Binary);
  });

  test('maps "number" to Number', () => {
    const type = mustInferIndexableScalarType({ type: 'number' });
    expect(type).toBe(DynamoDBIndexableScalarType.Number);
  });

  test('maps "integer" to Number', () => {
    const type = mustInferIndexableScalarType({ type: 'integer' });
    expect(type).toBe(DynamoDBIndexableScalarType.Number);
  });

  test('maps "string" to String', () => {
    const type = mustInferIndexableScalarType({ type: 'string' });
    expect(type).toBe(DynamoDBIndexableScalarType.String);
  });
});
