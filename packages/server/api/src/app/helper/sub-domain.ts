function getCommonSuffix(str1: string, str2: string): string {
  let commonSuffix = '';
  const minLength = Math.min(str1.length, str2.length);

  for (let i = 1; i <= minLength; i++) {
    if (str1[str1.length - i] === str2[str2.length - i]) {
      commonSuffix = str1[str1.length - i] + commonSuffix;
    } else {
      break;
    }
  }

  return commonSuffix;
}

function getDomain(url: string): string {
  let domain = url.split('//').pop();

  if (domain) {
    domain = domain.split('/')[0];
  } else {
    domain = '';
  }

  return domain;
}

export function getSubDomain(frontendUrl: string, tablesUrl: string): string {
  const frontendDomain = getDomain(frontendUrl);

  const tablesDomain = getDomain(tablesUrl);

  return getCommonSuffix(frontendDomain, tablesDomain);
}
