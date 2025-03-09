import validator from 'validator';
import { getUserByEmail } from './slack-api-request';

export async function getSlackIdFromPropertyInput(
  accessToken: string,
  inputValue: string | undefined,
): Promise<string> {
  if (typeof inputValue !== 'string') {
    throw new Error('Invalid input format provided for the user id/email.');
  }

  if (!inputValue || !validator.isEmail(inputValue)) {
    return inputValue || '';
  }

  const user = await getUserByEmail(accessToken, inputValue);

  if (!user) {
    throw new Error(
      `Could not find a user that matches the email ${inputValue}`,
    );
  }

  return user.id;
}
