import * as cdk from 'aws-cdk-lib';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

import { createParameterName } from '../constructs/resource-names';

import type { EnvironmentConfig } from '../config/environments';

export type PlatformStatefulStackProps = cdk.StackProps &
  Readonly<{
    environmentConfig: EnvironmentConfig;
    projectName: string;
  }>;

export class PlatformStatefulStack extends cdk.Stack {
  public readonly platformIdentifierParameterName: string;

  public constructor(scope: Construct, id: string, props: PlatformStatefulStackProps) {
    super(scope, id, {
      ...props,
      terminationProtection: props.environmentConfig.isProduction,
    });

    this.platformIdentifierParameterName = createParameterName(
      props.projectName,
      props.environmentConfig.name,
      'stateful/platform-identifier',
    );

    const platformIdentifier = new ssm.StringParameter(this, 'PlatformIdentifierParameter', {
      description: 'Stable platform identifier consumed by stateless stacks through SSM.',
      parameterName: this.platformIdentifierParameterName,
      stringValue: `${props.projectName}:${props.environmentConfig.name}`,
    });

    platformIdentifier.applyRemovalPolicy(
      props.environmentConfig.isProduction ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
    );

    new cdk.CfnOutput(this, 'PlatformIdentifierParameterName', {
      value: this.platformIdentifierParameterName,
    });
  }
}
