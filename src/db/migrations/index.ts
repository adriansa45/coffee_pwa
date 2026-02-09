import * as migration_20260203_220545_fix_users_id_type from './20260203_220545_fix_users_id_type';
import * as migration_20260209_005033_add_main_image from './20260209_005033_add_main_image';

export const migrations = [
  {
    up: migration_20260203_220545_fix_users_id_type.up,
    down: migration_20260203_220545_fix_users_id_type.down,
    name: '20260203_220545_fix_users_id_type',
  },
  {
    up: migration_20260209_005033_add_main_image.up,
    down: migration_20260209_005033_add_main_image.down,
    name: '20260209_005033_add_main_image'
  },
];
