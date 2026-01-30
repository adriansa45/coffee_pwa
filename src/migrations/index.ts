import * as migration_20260130_184533_init_better_auth from './20260130_184533_init_better_auth';

export const migrations = [
  {
    up: migration_20260130_184533_init_better_auth.up,
    down: migration_20260130_184533_init_better_auth.down,
    name: '20260130_184533_init_better_auth'
  },
];
