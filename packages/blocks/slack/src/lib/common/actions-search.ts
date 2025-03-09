interface ActionDropdownElement {
  label: string;
  value: string;
}

export function getMessageButtons(
  messageBlocks: any[],
): ActionDropdownElement[] {
  const result: ActionDropdownElement[] = [];
  const paths = findButtonPaths(messageBlocks);

  for (const path of paths) {
    const button = getObjectByPath(messageBlocks, path);

    result.push({
      label: button.text.text,
      value: button.text.text,
    });
  }

  return result;
}

function findButtonPaths(obj: any, path = ''): string[] {
  let paths: string[] = [];

  if (typeof obj === 'object' && obj !== null) {
    if (obj.type === 'button') {
      paths.push(path);
    }
    for (const key in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(key)) {
        const newPath = path ? `${path}.${key}` : key;
        paths = paths.concat(findButtonPaths(obj[key], newPath));
      }
    }
  }

  return paths;
}

function getObjectByPath(obj: any, path: string): any {
  return path.split('.').reduce((o, p) => (o ? o[p] : undefined), obj);
}
