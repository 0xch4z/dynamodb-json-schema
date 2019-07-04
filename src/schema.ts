import { JSONSchema4 } from 'json-schema';

export const ERR_SCHEMA_MUST_BE_OBJECT = `The JSON Schema for a table item must be of type 'object'`;
export const ERR_SCHEMA_MUST_HAVE_PROPERTIES = `The JSON Schema for a table item must have properties`;

export type JSONSchema = JSONSchema4 & {
  dynamoDBScalarType?: string;
};

export type JSONSchemaObject = JSONSchema & {
  type: 'object';
  properties: Record<string, JSONSchema>;
};

export function assertJSONSchemaObject(schema: JSONSchema) {
  if (schema.type !== 'object') {
    throw new Error(ERR_SCHEMA_MUST_BE_OBJECT);
  }

  if (!schema.properties || !Object.keys(schema.properties).length) {
    throw new Error(ERR_SCHEMA_MUST_HAVE_PROPERTIES);
  }

  return schema as JSONSchemaObject;
}
