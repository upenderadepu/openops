export interface MessageInfo {
  success: boolean;
  request_body: any;
  response_body: any;
}

export function getMessageObj(value: any): MessageInfo {
  if (!value) {
    throw new Error(
      'The provided argument is not a valid Slack message, please use an output from a previous Slack step.',
    );
  }

  let msg;

  if (typeof value === 'string') {
    try {
      msg = JSON.parse(value);
    } catch (e) {
      throw new Error(
        'The provided argument is not a valid Slack message, please use an output from a previous Slack step.',
      );
    }
  } else {
    msg = value;
  }

  if (!isMessageObj(msg)) {
    throw new Error(
      'The provided argument is not a valid Slack message, please use an output from a previous Slack step.',
    );
  }

  return msg;
}

export function isMessageObj(value: any): value is MessageInfo {
  if (!value) {
    return false;
  }

  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.success === 'boolean' &&
    typeof value.request_body === 'object' &&
    typeof value.response_body === 'object'
  );
}
