import {
  AttributeDefinitions,
  KeySchema,
  GlobalSecondaryIndex,
  LocalSecondaryIndex,
  Projection
} from "aws-sdk/clients/dynamodb";
import { JSONSchema, assertJSONSchemaObject, JSONSchemaObject } from "./schema";

import { mustInferIndexableScalarType } from "./scalar";
import { pluckUndefinedObjectValues } from "./util";

export interface TableSchema {
  AttributeDefintions: AttributeDefinitions;
  TableName?: string;
  KeySchema: KeySchema;
  LocalSecondaryIndexes?: LocalSecondaryIndex[];
  GlobalSecondaryIndexes?: GlobalSecondaryIndex[];
}

export interface IndexDefinition {
  hashKey?: string;
  rangeKey?: string;
}

export interface SecondaryIndexDefinition {
  indexName: string;
  projectionType?: string;
  nonKeyAttributes?: string[];
}

export interface GlobalSecondaryIndexDefiniton
  extends SecondaryIndexDefinition {
  hashKey: string;
  rangeKey?: string;
}

export interface LocalSecondaryIndexDefinition
  extends SecondaryIndexDefinition {
  rangeKey: string;
}

export interface SecondaryIndex {
  IndexName: string;
  KeySchema: KeySchema;
  Projection: Projection;
}

export interface GetTableSchemaOptions {
  tableName?: string;
  hashKey: string;
  rangeKey?: string;
  gsis?: GlobalSecondaryIndexDefiniton[];
  lsis?: LocalSecondaryIndexDefinition[];
  itemSchema: JSONSchema;
}

export const enum IndexKeyType {
  Hash = "HASH",
  Range = "RANGE"
}

export function getUniqueIndexedAttributes(indexes: IndexDefinition[]) {
  return indexes
    .reduce<Array<string | undefined>>(
      (acc, curr) => [...acc, curr.hashKey, curr.rangeKey],
      []
    )
    .filter(Boolean)
    .filter((name, i, a) => a.indexOf(name) === i);
}

function getKeySchemaFromIndexDefinition(index: IndexDefinition): KeySchema {
  return [
    index.hashKey && {
      AttributeName: index.hashKey,
      KeyType: IndexKeyType.Hash
    },
    index.rangeKey && {
      AttributeName: index.rangeKey,
      KeyType: IndexKeyType.Range
    }
  ].filter(Boolean);
}

function getAttributeDefinitionsFromSchema(
  indexedAttributes: string[],
  schema: JSONSchemaObject
) {
  return indexedAttributes.map(attribute => {
    const attributeSchema = schema.properties[attribute];
    if (typeof attributeSchema !== "object") {
      throw new Error(
        `Could not find schema definiton for specified indexed attribute '${attribute}'`
      );
    }

    const type = mustInferIndexableScalarType(attributeSchema);
    return { AttributeName: attribute, AttributeType: type };
  });
}

function getSecondaryIndexFromDefinition<
  T extends SecondaryIndexDefinition & IndexDefinition
>(definition: T): SecondaryIndex {
  return {
    IndexName: definition.indexName,
    KeySchema: getKeySchemaFromIndexDefinition(definition),
    Projection: {
      ProjectionType: definition.projectionType,
      NonKeyAttributes: definition.nonKeyAttributes
    }
  };
}

export function getTableSchema({
  tableName,
  itemSchema,
  hashKey,
  rangeKey,
  gsis = [],
  lsis = []
}: GetTableSchemaOptions): TableSchema {
  const schemaObject = assertJSONSchemaObject(itemSchema);
  const indexes = [{ hashKey, rangeKey }, ...gsis, ...lsis];
  const indexedAttributes = getUniqueIndexedAttributes(indexes);
  const keySchema = getKeySchemaFromIndexDefinition({ hashKey, rangeKey });
  const attributes = getAttributeDefinitionsFromSchema(
    indexedAttributes,
    schemaObject
  );

  const tableSchema: TableSchema = {
    TableName: tableName,
    AttributeDefintions: attributes,
    KeySchema: keySchema
  };

  if (gsis.length) {
    tableSchema.GlobalSecondaryIndexes = gsis.map(
      getSecondaryIndexFromDefinition
    );
  }

  if (lsis.length) {
    tableSchema.LocalSecondaryIndexes = lsis.map(
      getSecondaryIndexFromDefinition
    );
  }

  pluckUndefinedObjectValues(tableSchema);
  return tableSchema;
}
