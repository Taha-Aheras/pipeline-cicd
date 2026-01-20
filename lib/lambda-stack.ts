import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda  from 'aws-cdk-lib/aws-lambda';

export class lambdaStack extends cdk.Stack {
    
constructor(scope: Construct, id: string, props?: cdk.StackProps) {
  super(scope, id, props);

  const demoLambda = new lambda.Function(this, 'LambdaFunction', {
    runtime: lambda.Runtime.NODEJS_18_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline(`
      exports.handler = async (event, context) => {
        console.log("Event received:", JSON.stringify(event));
        console.log("Request ID:", context.awsRequestId);

        const response = {
          message: "Hello from an improved Lambda!",
          author: "TAHA",
          timestamp: new Date().toISOString(),
        };

        return {
          statusCode: 200,
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(response)
        };
      };
    `),
    timeout: cdk.Duration.seconds(10),
    memorySize: 256,
  });
}

}
