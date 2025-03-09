import { ActionBase, TriggerBase } from '@openops/blocks-framework';

import { StepMetadata } from '@openops/components/ui';
import { blocksHooks } from '../lib/blocks-hook';

jest.mock('@/app/lib/api', () => ({}));
jest.mock('react-markdown', () => {
  return function MockReactMarkdown(props: any) {
    return `MockReactMarkdown: ${JSON.stringify(props)}`;
  };
});

describe('useStepTemplateMetadata', () => {
  it('should return displayName and description from stepTemplateModel if provided', () => {
    const stepTemplateModel = {
      displayName: 'Action Display Name',
      description: 'Action Description',
    } as ActionBase;

    const result = blocksHooks.useStepTemplateMetadata({ stepTemplateModel });

    expect(result).toEqual({
      displayName: 'Action Display Name',
      description: 'Action Description',
    });
  });

  it('should return displayName and description from stepMetadata if stepTemplateModel is not provided', () => {
    const stepMetadata = {
      displayName: 'Metadata Display Name',
      description: 'Metadata Description',
    } as StepMetadata;

    const result = blocksHooks.useStepTemplateMetadata({ stepMetadata });

    expect(result).toEqual({
      displayName: 'Metadata Display Name',
      description: 'Metadata Description',
    });
  });

  it('should return empty displayName and description if neither stepTemplateModel nor stepMetadata is provided', () => {
    const result = blocksHooks.useStepTemplateMetadata({});

    expect(result).toEqual({
      displayName: '',
      description: '',
    });
  });

  it('should return displayName and description from stepTemplateModel if both stepTemplateModel and stepMetadata are provided', () => {
    const stepTemplateModel = {
      displayName: 'Trigger Display Name',
      description: 'Trigger Description',
    } as TriggerBase;

    const stepMetadata = {
      displayName: 'Metadata Display Name',
      description: 'Metadata Description',
    } as StepMetadata;

    const result = blocksHooks.useStepTemplateMetadata({
      stepTemplateModel,
      stepMetadata,
    });

    expect(result).toEqual({
      displayName: 'Trigger Display Name',
      description: 'Trigger Description',
    });
  });
});
