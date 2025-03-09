import { Client } from '@microsoft/microsoft-graph-client';
import { DropdownOption } from '@openops/blocks-framework';

export async function parseMsPaginatedData<T>(
  client: Client,
  response: any,
  options: DropdownOption<string>[],
  fn: (options: DropdownOption<string>[], elem: T) => void,
) {
  while (response.value.length > 0) {
    for (const elem of response.value as T[]) {
      fn(options, elem);
    }

    if (response['@odata.nextLink']) {
      response = await client.api(response['@odata.nextLink']).get();
    } else {
      break;
    }
  }
}
