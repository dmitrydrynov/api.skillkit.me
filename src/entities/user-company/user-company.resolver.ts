import CurrentUser from '@entities/auth/current-user.decorator';
import User, { UserRole } from '@entities/user/user.model';
import { prepareFindOptions } from '@helpers/prepare';
import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import UserCompany from './user-company.model';
import { UserCompanyOrderByInput, UserCompanyWhereInput } from './user-company.types';

@Resolver()
export class UserCompanyResolver {
  /**
   * UserCompanys list
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Query(() => [UserCompany])
  async userCompanies(
    @Arg('where', { nullable: true }) where: UserCompanyWhereInput,
    @Arg('orderBy', () => [UserCompanyOrderByInput], { nullable: true }) orderBy: UserCompanyOrderByInput[],
    @Arg('take', { nullable: true }) take: number,
    @Arg('skip', { nullable: true }) skip: number,
  ): Promise<Array<UserCompany>> {
    try {
      const findOptions: any = prepareFindOptions(where, take, skip, orderBy);

      const userCompanies: UserCompany[] = await UserCompany.findAll(findOptions);

      return userCompanies;
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Add a userCompany
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Mutation(() => UserCompany)
  async createUserCompany(@Arg('name') name: string, @CurrentUser() authUser: User): Promise<UserCompany> {
    try {
      const userCompany: UserCompany = await UserCompany.create({
        userId: authUser,
        name,
      });

      return userCompany;
    } catch (error) {
      throw Error(error.message);
    }
  }
}
