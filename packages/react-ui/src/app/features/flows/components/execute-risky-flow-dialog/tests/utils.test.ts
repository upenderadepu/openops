import {
  Action,
  ActionType,
  RiskLevel,
  Trigger,
  TriggerType,
} from '@openops/shared';

import {
  BlockStepMetadataWithSuggestions,
  StepMetadataWithSuggestions,
} from '@openops/components/ui';
import { getRiskyActionFormattedNames } from '../utils';

describe('getRiskyActionFormattedNames', () => {
  const actions: (Action | Trigger)[] = [
    {
      type: TriggerType.BLOCK,
    } as Trigger,
    {
      displayName: 'EC2 Get Instances',
      type: ActionType.BLOCK,
      settings: {
        blockName: '@openops/block-aws',
        actionName: 'ec2_get_instances',
      },
    } as Action,
    {
      displayName: 'EBS Modify Volume',
      type: ActionType.BLOCK,
      settings: {
        blockName: '@openops/block-aws',
        actionName: 'ebs_modify_volume',
      },
    } as Action,
  ];

  it('should return formatted names for high-risk actions', () => {
    const metadata: StepMetadataWithSuggestions[] = [
      {
        type: ActionType.BLOCK,
        blockName: '@openops/block-aws',
        suggestedActions: [
          {
            name: 'ec2_get_instances',
            displayName: 'EC2 Get Instances',
            riskLevel: RiskLevel.HIGH,
          },
          {
            name: 'ebs_modify_volume',
            displayName: 'EBS Modify Volume',
            riskLevel: RiskLevel.MEDIUM,
          },
        ],
      } as BlockStepMetadataWithSuggestions,
    ];

    const formattedNames = getRiskyActionFormattedNames(
      actions,
      metadata,
      RiskLevel.HIGH,
    );

    expect(formattedNames).toEqual(['2. EC2 Get Instances']);
  });

  it('should return an empty array when no actions match the risk level', () => {
    const metadata: StepMetadataWithSuggestions[] = [
      {
        type: ActionType.BLOCK,
        blockName: '@openops/block-aws',
        suggestedActions: [
          {
            name: 'ec2_get_instances',
            displayName: 'EC2 Get Instances',
            riskLevel: RiskLevel.MEDIUM,
          },
          {
            name: 'ebs_modify_volume',
            displayName: 'EBS Modify Volume',
            riskLevel: RiskLevel.LOW,
          },
        ],
      } as BlockStepMetadataWithSuggestions,
    ];

    const formattedNames = getRiskyActionFormattedNames(
      actions,
      metadata,
      RiskLevel.HIGH,
    );

    expect(formattedNames).toEqual([]);
  });

  it('should append metadata display name if different from action displayName', () => {
    const metadata: StepMetadataWithSuggestions[] = [
      {
        type: ActionType.BLOCK,
        blockName: '@openops/block-aws',
        suggestedActions: [
          {
            name: 'ec2_get_instances',
            displayName: 'AWS EC2 Instances',
            riskLevel: RiskLevel.HIGH,
          },
        ],
      } as BlockStepMetadataWithSuggestions,
    ];

    const formattedNames = getRiskyActionFormattedNames(
      actions,
      metadata,
      RiskLevel.HIGH,
    );

    expect(formattedNames).toEqual([
      '2. EC2 Get Instances (AWS EC2 Instances)',
    ]);
  });

  it('should correctly handle an undefined metadata', () => {
    const formattedNames = getRiskyActionFormattedNames(
      actions,
      undefined,
      RiskLevel.HIGH,
    );

    expect(formattedNames).toEqual([]);
  });
});
