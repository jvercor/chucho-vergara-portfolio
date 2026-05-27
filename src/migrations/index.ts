import * as migration_20260409_155721_initial from './20260409_155721_initial';
import * as migration_20260527_044348 from './20260527_044348';

export const migrations = [
  {
    up: migration_20260409_155721_initial.up,
    down: migration_20260409_155721_initial.down,
    name: '20260409_155721_initial',
  },
  {
    up: migration_20260527_044348.up,
    down: migration_20260527_044348.down,
    name: '20260527_044348'
  },
];
