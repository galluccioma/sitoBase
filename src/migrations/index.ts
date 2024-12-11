import * as migration_20241211_132100__add from './20241211_132100__add';

export const migrations = [
  {
    up: migration_20241211_132100__add.up,
    down: migration_20241211_132100__add.down,
    name: '20241211_132100__add'
  },
];
