import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const params = {
    TableName: process.env.tableName,
    // 'KeyConditionExpression' defines the condition for the query
    // - 'userId = :userId': only return items with matching 'userId'
    //   partition key
    // KeyConditionExpression: "userId = :userId",
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':userId': defines 'userId' to be the id of the author
    // ExpressionAttributeValues: {
    //   ":userId": "123",
    // },
  };

  const { fieldName, fieldValue } = event.body.fieldParameters;
  const result = await dynamoDb.scan(params);

  let updated = 0;
  for (const item of result.Items) {
    console.log('===================================================');
    console.log(item);
    if (item[fieldName] === undefined ) {
      const updateParams = {
        TableName: process.env.tableName,
        // 'Key' defines the partition key and sort key of the item to be updated
        Key: {
          userId: item.userId, // The id of the author
          noteId: item.noteId, // The id of the note from the path
        },
        // 'UpdateExpression' defines the attributes to be updated
        // 'ExpressionAttributeValues' defines the value in the update expression
        UpdateExpression: `SET ${fieldName} = :newfieldvalue`,
        ExpressionAttributeValues: {
          ":newfieldvalue": fieldValue || null,
        },
        // 'ReturnValues' specifies if and how to return the item's attributes,
        // where ALL_NEW returns all attributes of the item after the update; you
        // can inspect 'result' below to see how it works with different settings
        ReturnValues: "ALL_NEW",
      };

      await dynamoDb.update(updateParams);
      updated++;
    }
    // item[fieldName] = fieldValue;
    // console.log(item);
  }
  // Return the matching list of items in response body
  return { "updated": updated };
});