import { Static, Type } from '@sinclair/typebox';
import { OpenOpsId } from '../../common/id-generator';
import { EmailType, PasswordType } from '../../user/user';

export const SignUpRequest = Type.Object({
  email: EmailType,
  password: PasswordType,
  firstName: Type.String(),
  lastName: Type.String(),
  trackEvents: Type.Boolean(),
  newsLetter: Type.Boolean(),
  referringUserId: Type.Optional(OpenOpsId),
});

export type SignUpRequest = Static<typeof SignUpRequest>;
