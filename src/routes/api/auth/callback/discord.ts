import fetch from 'cross-fetch';
import { FastifyPluginAsync } from 'fastify';

const discordCallback: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/discord', async function (request) {
    try {
      const token = await this.discordOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

      const userData = await fetch('https://discord.com/api/users/@me', {
        headers: {
          authorization: `${token.token_type} ${token.access_token}`,
        },
      });

      const json = await userData.json();
      console.log(json);

      // create internal token and return it

      return token;
    } catch (error) {
      throw Error(error.message);
    }
  });
};

export default discordCallback;
