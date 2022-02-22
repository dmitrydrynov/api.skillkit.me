import { JWTUserData } from '@entities/user/user.types';
import { MercuriusContext } from 'mercurius';
import { AuthChecker, ResolverData } from 'type-graphql';

export const authChecker: AuthChecker<MercuriusContext> = (
  { context }: ResolverData<MercuriusContext>,
  roles: string[],
) => {
  try {
    const jwtData: JWTUserData = context.app.jwt.verify(context.reply.request.headers['authorization']);

    console.log('[LOG authChecker]', jwtData, roles);

    if (roles.includes(jwtData.role) === false) {
      return false;
    }

    return true;
  } catch (exception) {
    context.app.log.debug('Exception');
    context.app.log.error(exception);

    return false;
  }
};
