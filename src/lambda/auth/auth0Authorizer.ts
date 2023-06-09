import {
  CustomAuthorizerEvent,
  CustomAuthorizerResult,
  CustomAuthorizerHandler,
} from 'aws-lambda';

import 'source-map-support/register';

export const handler: CustomAuthorizerHandler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  try {
    verifyToken(event.authorizationToken);
    console.log('User was authorized');

    const test = {
      principalId: 'user',
      policyDocument: {
        Version: '2010-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
    };

    console.log('Authorized success: ', test);

    return test;
  } catch (e) {
    console.log('User was not authorized', e.message);
    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*',
          },
        ],
      },
    };
  }
};

function verifyToken(authHeader: string) {
  if (!authHeader) throw new Error('No authentication header');
  if (!authHeader.toLocaleLowerCase().startsWith('bearer '))
    throw new Error('Invalid authorization header');

  const split = authHeader.split(' ');
  const token = split[1];

  if (token !== '123') throw new Error('Invalid token');
}
