import * as migration_20260409_155721_initial from './20260409_155721_initial';
import * as migration_20260527_044348 from './20260527_044348';
import * as migration_20260528_092154_add_solid_button_appearance from './20260528_092154_add_solid_button_appearance';
import * as migration_20260601_214845_add_footer_social_links from './20260601_214845_add_footer_social_links';
import * as migration_20260602_190000_add_medium_impact_download_fields from './20260602_190000_add_medium_impact_download_fields';
import * as migration_20260607_223200_add_logo_wall_block from './20260607_223200_add_logo_wall_block';
import * as migration_20260608_180000_add_home_hero_fields from './20260608_180000_add_home_hero_fields';
import * as migration_20260608_190000_add_home_hero_code_fields from './20260608_190000_add_home_hero_code_fields';
import * as migration_20260708_051803 from './20260708_051803';

export const migrations = [
  {
    up: migration_20260409_155721_initial.up,
    down: migration_20260409_155721_initial.down,
    name: '20260409_155721_initial',
  },
  {
    up: migration_20260527_044348.up,
    down: migration_20260527_044348.down,
    name: '20260527_044348',
  },
  {
    up: migration_20260528_092154_add_solid_button_appearance.up,
    down: migration_20260528_092154_add_solid_button_appearance.down,
    name: '20260528_092154_add_solid_button_appearance',
  },
  {
    up: migration_20260601_214845_add_footer_social_links.up,
    down: migration_20260601_214845_add_footer_social_links.down,
    name: '20260601_214845_add_footer_social_links',
  },
  {
    up: migration_20260602_190000_add_medium_impact_download_fields.up,
    down: migration_20260602_190000_add_medium_impact_download_fields.down,
    name: '20260602_190000_add_medium_impact_download_fields',
  },
  {
    up: migration_20260607_223200_add_logo_wall_block.up,
    down: migration_20260607_223200_add_logo_wall_block.down,
    name: '20260607_223200_add_logo_wall_block',
  },
  {
    up: migration_20260608_180000_add_home_hero_fields.up,
    down: migration_20260608_180000_add_home_hero_fields.down,
    name: '20260608_180000_add_home_hero_fields',
  },
  {
    up: migration_20260608_190000_add_home_hero_code_fields.up,
    down: migration_20260608_190000_add_home_hero_code_fields.down,
    name: '20260608_190000_add_home_hero_code_fields',
  },
  {
    up: migration_20260708_051803.up,
    down: migration_20260708_051803.down,
    name: '20260708_051803'
  },
];
