import { AppLogo } from '@/app/common/components/app-logo';
import { AuthFormTemplate } from '@/app/features/authentication/components/auth-form-template';

const SignUpPage: React.FC = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <AppLogo />
      <AuthFormTemplate form={'signup'} />
    </div>
  );
};

SignUpPage.displayName = 'SignUpPage';

export { SignUpPage };
