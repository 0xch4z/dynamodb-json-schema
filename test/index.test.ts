import { getTableSchema } from '../src';
import { ERR_SCHEMA_MUST_BE_OBJECT, JSONSchema } from '../src/schema';

describe('getTableSchema', () => {
  test('throws error on invalid JSON Schema object', () => {
    expect(() =>
      getTableSchema({
        tableName: 'some-table',
        hashKey: 'someHashKey',
        itemSchema: { type: 'boolean' } // should be an object
      })
    ).toThrowError(ERR_SCHEMA_MUST_BE_OBJECT);
  });

  test('throws error when indexed attribute not included in JSON schema', () => {
    expect(() =>
      getTableSchema({
        tableName: 'some-table',
        hashKey: 'someKeyNotInSchema',
        itemSchema: {
          type: 'object',
          properties: {
            someIndexedAttribute: { type: 'string' }
          }
        }
      })
    ).toThrowError(
      `Could not find schema definiton for specified indexed attribute 'someKeyNotInSchema'`
    );
  });

  test('should return proper table schema for valid JSON schema', () => {
    const itemSchema: JSONSchema = {
      type: 'object',
      properties: {
        myHashKey: { type: 'string' }
      }
    };
    const tableSchema = getTableSchema({
      tableName: 'some-table',
      hashKey: 'myHashKey',
      itemSchema
    });

    expect(tableSchema).toMatchSnapshot();
  });

  test('should return proper table schema for valid JSON schema with secondary indexes', () => {
    const itemSchema: JSONSchema = {
      type: 'object',
      properties: {
        id: { type: 'string' },
        login: { type: 'string' },
        name: { type: 'string' },
        age: { type: 'integer' }
      }
    };

    const tableSchema = getTableSchema({
      tableName: 'user-table',
      hashKey: 'id',
      gsis: [
        {
          indexName: 'byLogin',
          hashKey: 'login',
          projectionType: 'ALL'
        }
      ],
      lsis: [
        {
          indexName: 'byName',
          rangeKey: 'name',
          projectionType: 'ALL'
        }
      ],
      itemSchema
    });

    expect(tableSchema).toMatchSnapshot();
  });
});
