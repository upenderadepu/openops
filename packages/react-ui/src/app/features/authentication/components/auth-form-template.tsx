import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@openops/components/ui';
import React from 'react';

import { t } from 'i18next';
import { SignInForm } from './sign-in-form';
import { SignUpForm } from './sign-up-form';

const AuthFormTemplate = React.memo(
  ({ form }: { form: 'signin' | 'signup' }) => {
    const isSignUp = form === 'signup';

    const data = {
      signin: {
        title: t('Welcome Back!'),
        description: t('Enter your email below to sign in to your account'),
        showNameFields: false,
      },
    };

    return (
      <Card className="w-[28rem] rounded-sm drop-shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{data.signin.title}</CardTitle>
          <CardDescription>{data.signin.description}</CardDescription>
        </CardHeader>
        <CardContent>{isSignUp ? <SignUpForm /> : <SignInForm />}</CardContent>
      </Card>
    );
  },
);

AuthFormTemplate.displayName = 'AuthFormTemplate';

export { AuthFormTemplate };
