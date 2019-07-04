# dynamodb-json-schema [![Build Status](https://travis-ci.org/charliekenney23/dynamodb-json-schema.svg?branch=master)](https://travis-ci.org/charliekenney23/dynamodb-json-schema) [![Greenkeeper badge](https://badges.greenkeeper.io/Charliekenney23/dynamodb-json-schema.svg)](https://greenkeeper.io/)

> Generate dynamodb table schema from json schema

## Example Usage

```ts
import * as fs from "fs";
import { getTableSchema } from "dynamodb-json-schema";

const USER_SCHEMA = JSON.parse(fs.readFileSync("User.json", "utf8"));

const tableSchema = getTableSchema({
  tableName: "users-table",
  hashKey: "id",
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
