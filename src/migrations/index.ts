import * as migration_20261111_171322_initial from './20261111_171322_initial';
import * as migration_20261111_181203_initiative_sort_default from './20261111_181203_initiative_sort_default';
import * as migration_20261111_181939_form_links from './20261111_181939_form_links';
import * as migration_20261112_092213_media_watermark from './20261112_092213_media_watermark';
import * as migration_20261112_105108_blob_storage_fields from './20261112_105108_blob_storage_fields';
import * as migration_20261112_151706_sister_initiative_page from './20261112_151706_sister_initiative_page';
import * as migration_20261116_130950_about_page from './20261116_130950_about_page';
import * as migration_20261116_133828_value_icons from './20261116_133828_value_icons';
import * as migration_20261117_151614_legal_status from './20261117_151614_legal_status';
import * as migration_20261117_174839_blog_authors from './20261117_174839_blog_authors';

export const migrations = [
  {
    up: migration_20261111_171322_initial.up,
    down: migration_20261111_171322_initial.down,
    name: '20261111_171322_initial',
  },
  {
    up: migration_20261111_181203_initiative_sort_default.up,
    down: migration_20261111_181203_initiative_sort_default.down,
    name: '20261111_181203_initiative_sort_default',
  },
  {
    up: migration_20261111_181939_form_links.up,
    down: migration_20261111_181939_form_links.down,
    name: '20261111_181939_form_links',
  },
  {
    up: migration_20261112_092213_media_watermark.up,
    down: migration_20261112_092213_media_watermark.down,
    name: '20261112_092213_media_watermark',
  },
  {
    up: migration_20261112_105108_blob_storage_fields.up,
    down: migration_20261112_105108_blob_storage_fields.down,
    name: '20261112_105108_blob_storage_fields',
  },
  {
    up: migration_20261112_151706_sister_initiative_page.up,
    down: migration_20261112_151706_sister_initiative_page.down,
    name: '20261112_151706_sister_initiative_page',
  },
  {
    up: migration_20261116_130950_about_page.up,
    down: migration_20261116_130950_about_page.down,
    name: '20261116_130950_about_page',
  },
  {
    up: migration_20261116_133828_value_icons.up,
    down: migration_20261116_133828_value_icons.down,
    name: '20261116_133828_value_icons',
  },
  {
    up: migration_20261117_151614_legal_status.up,
    down: migration_20261117_151614_legal_status.down,
    name: '20261117_151614_legal_status',
  },
  {
    up: migration_20261117_174839_blog_authors.up,
    down: migration_20261117_174839_blog_authors.down,
    name: '20261117_174839_blog_authors'
  },
];
