import { FormMessage } from '@openops/components/ui';

const FormMessages = ({ messages }: { messages: string[] }) => {
  const message = messages.find((message) => message);
  return (
    <div className="flex flex-col gap-2 my-1">
      {message && <FormMessage>{message}</FormMessage>}
    </div>
  );
};

FormMessages.displayName = 'FormMessages';
export { FormMessages };
