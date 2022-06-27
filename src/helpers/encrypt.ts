import { randomInt } from 'crypto';
import { env } from '@config/env';
import { Sequelize } from 'sequelize';
import { ModelCtor } from 'sequelize-typescript';
import { Fn } from 'sequelize/lib/utils';

export type DecryptionOptions = {
  as: string;
  attributes: string[];
  model: ModelCtor;
};

export function encryptPassword(sequelize: Sequelize, password: string): Fn {
  return Sequelize.fn('crypt', Sequelize.literal(sequelize.escape(password)), Sequelize.fn('gen_salt', 'bf', 8));
}

export function verifyPassword(sequelize: Sequelize, column: string, password: string): Fn {
  return Sequelize.fn('crypt', Sequelize.literal(sequelize.escape(password)), Sequelize.col(column));
}

export function pgpEncrypt(sequelize: Sequelize, value: string, iterations = 1024): Fn {
  const count = iterations >= 1024 && iterations <= 65011712 ? iterations : randomInt(65536, 262144);

  return Sequelize.fn(
    'pgp_sym_encrypt',
    Sequelize.literal(sequelize.escape(value)),
    env.ENCRYPT_PASS,
    `s2k-mode=3, s2k-count=${count}`,
  );
}

export function pgpDecrypt(column: string): Fn {
  return Sequelize.fn('pgp_sym_decrypt', Sequelize.cast(Sequelize.col(column), 'bytea'), env.ENCRYPT_PASS);
}

export function pgpDecryptAttribute(
  table: string,
  attributes: string[],
  column: string | string[],
): Array<Fn | string> {
  if ((attributes?.length ?? 0) === 0) {
    return [];
  }

  const columns = Array.isArray(column) ? column : [column];

  return attributes.map((attribute) => {
    if (columns.includes(attribute)) {
      const alias = table == null ? attribute : `${table}.${attribute}`;

      return [pgpDecrypt(alias), attribute];
    }

    return attribute;
  });
}
