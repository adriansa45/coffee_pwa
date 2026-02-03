import * as migration_20260203_220545_fix_users_id_type from './20260203_220545_fix_users_id_type';

export const migrations = [
  {
    up: migration_20260203_220545_fix_users_id_type.up,
    down: migration_20260203_220545_fix_users_id_type.down,
    name: '20260203_220545_fix_users_id_type'
  },
];
