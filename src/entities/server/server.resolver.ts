import { Query, Resolver } from 'type-graphql';
import { HealthReponseType } from './server.types';

@Resolver()
export class ServerResolver {
  @Query(() => HealthReponseType)
  health(): HealthReponseType {
    try {
      return { healthy: true };
    } catch (error) {
      return {
        healthy: false,
        error: error.message,
      };
    }
  }
}
