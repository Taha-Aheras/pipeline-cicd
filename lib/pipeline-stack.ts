
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
  ManualApprovalStep,
} from 'aws-cdk-lib/pipelines';
import { PipelineAppStage } from './pipeline-app-stack'; // make sure this file exists and exports PipelineAppStag


export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const pipeline = new CodePipeline(this, 'demopipeline2', {
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.connection(
          'Taha-Aheras/pipeline-cicd',
          'main',{
            connectionArn: 'arn:aws:codeconnections:us-east-1:655024857340:connection/6f5d6f1b-72d0-4ed7-979b-36db191e5ad9'
          }  
        ),
        commands: ['npm ci', 'npm run build', 'npx cdk synth'],
      }),
    });
 
   
    const testingstage = pipeline.addStage(
      new PipelineAppStage(this , "test", {
          env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
      })
    )
 
    testingstage.addPost(new ManualApprovalStep('approval'))
 
     pipeline.addStage(
      new PipelineAppStage(this , "prod", {
          env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
      })
    )


    
  }
}
