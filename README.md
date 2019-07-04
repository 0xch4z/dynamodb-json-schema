# dynamodb-json-schema

> Generate dynamodb table schema from json schema

## Example Usage

```ts
import * as fs from 'fs';
import { getTableSchema } from 'dynamodb-json-schema';

const USER_SCHEMA = JSON.parse(fs.readFileSync('User.json', 'utf8'));

const tableSchema = getTableSchema({
  tableName: 'users-table',
  hashKey: 'id',
  itemSchema: USER_SCHEMA
});

/*
=> {
  "TableName": "users-table",
  "KeySchema": [{
    "AttributeName": "id",
    "AttributeType": "HASH"
  }],
  "AttributeDefinitions": [{
    "AttributeName": "id",
    "AttributeType": "S"
  }]
}
*/
```
