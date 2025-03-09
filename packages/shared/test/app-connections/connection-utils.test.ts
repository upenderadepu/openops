import {
  addConnectionBrackets,
  removeConnectionBrackets,
} from '../../src/lib/app-connection/connections-utils';

describe('addConnectionBrackets', () => {
  it('should add connection brackets around a given string', () => {
    const input = 'databaseConnection';
    const expected = "{{connections['databaseConnection']}}";
    expect(addConnectionBrackets(input)).toBe(expected);
  });

  it('should handle an empty string input', () => {
    const input = '';
    const expected = "{{connections['']}}";
    expect(addConnectionBrackets(input)).toBe(expected);
  });
});

describe('removeConnectionBrackets', () => {
  it('should remove connection brackets and return the original string', () => {
    const input = "{{connections['databaseConnection']}}";
    const expected = 'databaseConnection';
    expect(removeConnectionBrackets(input)).toBe(expected);
  });

  it('should return undefined when the input is undefined', () => {
    expect(removeConnectionBrackets(undefined)).toBeUndefined();
  });

  it('should return the input string if there are no connection brackets', () => {
    const input = 'noBracketsHere';
    expect(removeConnectionBrackets(input)).toBe(input);
  });

  it('should handle strings with multiple connection brackets', () => {
    const input =
      "{{connections['connection1']}} and {{connections['connection2']}}";
    const expected = 'connection1 and connection2';
    expect(removeConnectionBrackets(input)).toBe(expected);
  });
});
