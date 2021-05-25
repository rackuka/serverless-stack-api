import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const { fieldName } = event.body.fieldParameters;

  const params = {
    TableName: 'prod-wingednews', // <== defs.WN_STR_KEY_TABLE
    FilterExpression: "#field = :value AND NOT (#newfield = :trueval) AND NOT (#newfield = :falseval)",
    ExpressionAttributeNames: {
      "#field" : event.body.filter.fieldName,
      "#newfield" : fieldName
    },
    ExpressionAttributeValues: {
      ":value": event.body.filter.fieldValue,
      ":trueval" : true, // important since you use boolean for true and string for false
      ":falseval" : 'false'
    }
  };
  // console.log(event);

  let result = await dynamoDb.scan(params);
  printResults(result);

  while(typeof result.LastEvaluatedKey != 'undefined') {
    console.log(`SCAN NEXT: ${result.LastEvaluatedKey}`);
    params.ExclusiveStartKey = result.LastEvaluatedKey;
    result = await dynamoDb.scan(params);
    printResults(result);
  }
  // Return the matching list of items in response body
  return "Ok";
});

function printResults(result) {
  for (const item of result.Items) {
    console.log('===================================================');
    console.log(item);
  }
}
