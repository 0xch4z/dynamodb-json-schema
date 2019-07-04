import { JSONSchema } from './schema';

export const enum DynamoDBIndexableScalarType {
  Number = 'N',
  String = 'S',
  Binary = 'B'
}

export function mustIndexableScalarType(identifier: string) {
  switch (identifier) {
    case DynamoDBIndexableScalarType.Binary:
      return DynamoDBIndexableScalarType.Binary;
    case DynamoDBIndexableScalarType.Number:
      return DynamoDBIndexableScalarType.Number;
    case DynamoDBIndexableScalarType.String:
      return DynamoDBIndexableScalarType.String;
    default:
      throw new Error(`Invalid DynamoDB indexable scalar type ${identifier}`);
  }
}

export function mustInferIndexableScalarType({
  dynamoDBScalarType,
  type
}: JSONSchema): DynamoDBIndexableScalarType {
  if (dynamoDBScalarType) {
    return mustIndexableScalarType(dynamoDBScalarType);
  }

  switch (type) {
    case 'integer':
    case 'number':
      return DynamoDBIndexableScalarType.Number;
    case 'string':
      return DynamoDBIndexableScalarType.String;
    default:
      throw new Error(
        `Cannot infer indexable scalar type from JSON Schema type '${type}'`
      );
  }
}
