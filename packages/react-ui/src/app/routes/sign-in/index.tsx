import { AppLogo } from '@/app/common/components/app-logo';
import { AuthFormTemplate } from '@/app/features/authentication/components/auth-form-template';

const SignInPage: React.FC = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <AppLogo />
      <AuthFormTemplate form={'signin'} />
    </div>
  );
};

SignInPage.displayName = 'SignInPage';

export { SignInPage };
