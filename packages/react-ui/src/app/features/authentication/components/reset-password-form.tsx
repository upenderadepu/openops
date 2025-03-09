import { typeboxResolver } from '@hookform/resolvers/typebox';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormField,
  FormItem,
  FormMessage,
  INTERNAL_ERROR_TOAST,
  Input,
  Label,
  toast,
} from '@openops/components/ui';
import { Static, Type } from '@sinclair/typebox';
import { useMutation } from '@tanstack/react-query';
import { t } from 'i18next';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { HttpError, api } from '@/app/lib/api';
import { authenticationApi } from '@/app/lib/authentication-api';

export enum OtpType {
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  PASSWORD_RESET = 'PASSWORD_RESET',
}

const FormSchema = Type.Object({
  email: Type.String({
    errorMessage: t('Please enter your email'),
  }),
  type: Type.Enum(OtpType),
});

type FormSchema = Static<typeof FormSchema>;

const ResetPasswordForm = () => {
  const [isSent, setIsSent] = useState<boolean>(false);
  const form = useForm<FormSchema>({
    resolver: typeboxResolver(FormSchema),
    defaultValues: {
      type: OtpType.PASSWORD_RESET,
    },
  });

  const { mutate, isPending } = useMutation<void, HttpError, any>({
    mutationFn: authenticationApi.sendOtpEmail,
    onSuccess: () => setIsSent(true),
    onError: (error) => {
      if (api.isError(error)) {
        toast(INTERNAL_ERROR_TOAST);
      }
    },
  });

  const onSubmit: SubmitHandler<any> = (data) => {
    mutate(data);
  };

  return (
    <Card className="w-[28rem] rounded-sm drop-shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">
          {isSent ? t('Check Your Inbox') : t('Reset Password')}
        </CardTitle>
        <CardDescription>
          {isSent && (
            <span>
              {t(
                `If the user exists we'll send you an email with a link to reset your password.`,
              )}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isSent && (
          <Form {...form}>
            <form className="grid ">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full grid space-y-2">
                    <Label htmlFor="email">{t('Email')}</Label>
                    <Input
                      {...field}
                      type="text"
                      placeholder={'email@example.com'}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="w-full mt-4"
                loading={isPending}
                onClick={(e) => form.handleSubmit(onSubmit)(e)}
              >
                {t('Send Password Reset Link')}
              </Button>
            </form>
          </Form>
        )}
        <div className="mt-4 text-center text-sm">
          <Link to="/sign-in" className="text-muted-foreground">
            {t('Back to sign in')}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

ResetPasswordForm.displayName = 'ResetPassword';

export { ResetPasswordForm };
