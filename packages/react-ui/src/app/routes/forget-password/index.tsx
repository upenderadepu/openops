import { AppLogo } from '@/app/common/components/app-logo';
import { ResetPasswordForm } from '@/app/features/authentication/components/reset-password-form';

const ResetPasswordPage = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <AppLogo />
      <ResetPasswordForm />
    </div>
  );
};

export { ResetPasswordPage };
