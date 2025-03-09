import { AppLogo } from '@/app/common/components/app-logo';
import { ChangePasswordForm } from '@/app/features/authentication/components/change-password';

const ChangePasswordPage = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <AppLogo />
      <ChangePasswordForm />
    </div>
  );
};

export { ChangePasswordPage };
