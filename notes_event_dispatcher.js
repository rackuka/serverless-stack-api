import handler from "./libs/handler-lib";
import {JSONPath} from 'jsonpath-plus';

export const main = handler(async (event, context) => {
  // console.log(JSON.stringify(event, null, 2));
  // console.log(JSON.stringify(context, null, 2));

  let parsed = JSONPath({path: '$.Records[*].dynamodb', json: event, resultType: 'value'});

  console.log(JSON.stringify(parsed, null, 2));

  console.log(JSON.stringify(process.env.PARAM3, null, 2));

  console.log('going to parse json: ', process.env.PARAM3);
  let a = JSON.parse(process.env.PARAM3);
  // {type: 'add', path: '$.Records[*].dynamodb', handler: 'add_notification_event'};
  let sA = JSON.stringify(a);
  // console.log(JSON.stringify(JSON.parse(process.env.PARAM3), null, 2));
  console.log(JSON.stringify(JSON.parse(sA), null, 2));

  a.forEach(element => {
    console.log('type: ', element.type);
  });

  return "Done";
});