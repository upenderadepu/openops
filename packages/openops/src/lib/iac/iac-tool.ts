export type IaCTool = 'terraform' | 'cloudformation';

export function generateIaCOptions(
  iacTool: IaCTool,
  propertyNames: Record<string, Record<IaCTool, string>>,
) {
  return Object.keys(propertyNames)
    .map((propertyName: string) => ({
      label: propertyName,
      value: propertyNames[propertyName][iacTool],
    }))
    .filter(
      (item): item is { label: string; value: string } =>
        item.value !== undefined,
    );
}
