import * as cdk from 'aws-cdk-lib';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

import { createResourceName } from '../constructs/resource-names';

import type { EnvironmentConfig } from '../config/environments';

export type CoreApiStackProps = cdk.StackProps &
  Readonly<{
    environmentConfig: EnvironmentConfig;
    platformIdentifierParameterName: string;
    projectName: string;
  }>;

export class CoreApiStack extends cdk.Stack {
  public constructor(scope: Construct, id: string, props: CoreApiStackProps) {
    super(scope, id, props);

    const platformIdentifier = ssm.StringParameter.valueForStringParameter(
      this,
      props.platformIdentifierParameterName,
    );

    const resolverLogGroup = new logs.LogGroup(this, 'CoreHealthResolverLogGroup', {
      logGroupName: `/aws/lambda/${createResourceName(
        props.projectName,
        props.environmentConfig.name,
        'core-health-resolver',
      )}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      retention: logs.RetentionDays.ONE_WEEK,
    });

    const resolverFunction = new NodejsFunction(this, 'CoreHealthResolverFunction', {
      bundling: {
        minify: true,
        sourceMap: true,
        target: 'node22',
        tsconfig: 'services/core-api/tsconfig.service.json',
      },
      entry: 'services/core-api/src/index.ts',
      functionName: createResourceName(
        props.projectName,
        props.environmentConfig.name,
        'core-health-resolver',
      ),
      handler: 'handler',
      logGroup: resolverLogGroup,
      runtime: lambda.Runtime.NODEJS_22_X,
    });

    const api = new appsync.GraphqlApi(this, 'CoreApi', {
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM,
        },
      },
      definition: appsync.Definition.fromFile('services/core-api/schema/core.graphql'),
      logConfig: {
        fieldLogLevel: appsync.FieldLogLevel.ALL,
      },
      name: createResourceName(props.projectName, props.environmentConfig.name, 'core-api'),
      xrayEnabled: true,
    });

    const dataSource = api.addLambdaDataSource('CoreHealthDataSource', resolverFunction);
    dataSource.createResolver('GetCoreHealthResolver', {
      fieldName: 'getCoreHealth',
      typeName: 'Query',
    });

    new cdk.CfnOutput(this, 'GraphqlApiId', {
      value: api.apiId,
    });

    new cdk.CfnOutput(this, 'GraphqlApiUrl', {
      value: api.graphqlUrl,
    });

    new cdk.CfnOutput(this, 'ImportedPlatformIdentifier', {
      value: platformIdentifier,
    });
  }
}
