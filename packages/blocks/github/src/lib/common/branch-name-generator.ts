export function generateBranchName(baseString: string): string {
  let formattedName = baseString.toLowerCase();

  formattedName = formattedName
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^a-z0-9\-/_]/g, '-') // Replace invalid characters with hyphens
    .replace(/\/+/g, '/') // Ensure no consecutive slashes
    .replace(/^[-/]+|[-/]+$/g, ''); // Remove leading and trailing slashes or hyphens

  const unixTimestamp = Math.floor(Date.now());

  return `openops/${formattedName}-${unixTimestamp}`;
}
