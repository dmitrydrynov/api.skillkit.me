import { MercuriusContext } from 'mercurius';
import { createParamDecorator } from 'type-graphql';

export default function CurrentUser() {
  return createParamDecorator<MercuriusContext>(({ context }) => context.user);
}
