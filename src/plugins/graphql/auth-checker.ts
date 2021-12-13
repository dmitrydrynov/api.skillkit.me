import { UserRole } from '@models/User';
import { MercuriusContext } from 'mercurius';
import { AuthChecker, ResolverData } from 'type-graphql';

export const authChecker: AuthChecker<MercuriusContext> = (
  { context }: ResolverData<MercuriusContext>,
  roles: string[],
) => {
  try {
    const { id, role = UserRole.UNKNOWN }: { id: number; role: UserRole } = context.app.jwt.verify(
      context.reply.request.headers['authorization'],
    );

    // check auth user
    console.log(roles, id, role);

    if (roles.includes(role) === false) {
      return false;
    }

    return true;
  } catch (exception) {
    context.app.log.debug('Exception');
    context.app.log.error(exception);

    return false;
  }
};
