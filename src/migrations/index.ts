import * as migration_20261111_171322_initial from './20261111_171322_initial';
import * as migration_20261111_181203_initiative_sort_default from './20261111_181203_initiative_sort_default';
import * as migration_20261111_181939_form_links from './20261111_181939_form_links';
import * as migration_20261112_092213_media_watermark from './20261112_092213_media_watermark';
import * as migration_20261112_105108_blob_storage_fields from './20261112_105108_blob_storage_fields';

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
    name: '20261112_105108_blob_storage_fields'
  },
];
