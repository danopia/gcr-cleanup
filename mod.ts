#!/usr/bin/env -S deno run --allow-run --allow-net --allow-read
import { createClient } from "https://deno.land/x/docker_registry_client@v0.1.0/registry-client-v2.ts";
import * as TOML from "https://deno.land/std@0.92.0/encoding/toml.ts";

const GIGABYTE = 1024 * 1024 * 1024;
const DAY = 24 * 60 * 60 * 1000;

// load up configuration
const cfgPath = Deno.args[0] ?? new URL('gcr-cleanup.toml', import.meta.url);
const config = TOML.parse(await Deno.readTextFile(cfgPath)) as Config;
const rules = config.rule.map(r => ({ ...r,
  imageRegExps: r.image_patterns?.map(x => new RegExp(`^${x}$`)),
  tagRegExp: r.tag_filter ? new RegExp(`^${r.tag_filter}$`) : null,
}));

// configure auth
const password = Deno.env.get('GCLOUD_TOKEN');
const getClient = async (name: string) => createClient({ name,
  username: 'oauth2accesstoken', password,
  scopes: Deno.args.includes('--yes') ? ['push', 'pull'] : ['pull'],
});

// build a data structure of all repositories
const rootClient = await getClient(config.repository);
const rootTags = await rootClient.listTags();
if (!rootTags.child) throw new Error(`No children under ${config.repository}`);
const repos = rootTags.child.map<Repo>(imageName => ({ imageName }));

console.log('Processing', repos.length, 'image repositories...');
for (const repo of repos) {
  try {
    // download tag info (gcr doesn't do pagination)
    const client = await getClient(`${config.repository}/${repo.imageName}`);
    const { tags, manifest } = await client.listTags();

    // process the data just a bit
    const manifests = Object.entries(manifest ?? {})
      .map(([digest, info]) => ({
        digest, ...info,
        imageBytes: Number(info.imageSizeBytes ?? '0'),
        uploadedAt: new Date(Number(info.timeUploadedMs ?? undefined)),
      }))
      .filter(x => !isNaN(x.uploadedAt.valueOf()))
      .sort((a, b) => a.uploadedAt.valueOf() - b.uploadedAt.valueOf());

    const bytesBefore = manifests.reduce((sum, x) => sum + x.imageBytes, 0);
    repo.tagsBefore = manifests.reduce((sum, x) => sum + x.tag.length, 0);
    repo.gbBefore = Math.round(bytesBefore / GIGABYTE);
    repo.oldestBefore = manifests[0]?.uploadedAt;

    // Find a rule and start applying it
    const rule = rules.find(r => r.imageRegExps?.some(x => x.test(repo.imageName)) ?? true);
    if (!rule) continue;
    let toDel = manifests;

    // Consider if we can untag, and which tags are ok to delete
    if (rule.allow_tagged) {
      if (rule.tagRegExp) toDel = toDel
        .filter(x => x.tag.every(t => rule.tagRegExp!.test(t)));
    } else toDel = toDel
      .filter(x => x.tag.length === 0);

    const keep_count = rule.keep_count ?? (rule.allow_tagged ? 25 : 0);
    toDel = toDel.slice(0, -keep_count);

    if (rule.keep_days) {
      const cutoff = Date.now() - (rule.keep_days * DAY);
      toDel = toDel
        .filter(image => image.uploadedAt.valueOf() < cutoff);
    }

    const bytesDeleted = toDel.reduce((sum, x) => sum + x.imageBytes, 0);
    repo.tagsDeleted = toDel.reduce((sum, x) => sum + x.tag.length, 0);
    repo.gbDeleted = Math.round(bytesDeleted / GIGABYTE);
    repo.oldestAfter = manifests.find(x => !toDel.includes(x))?.uploadedAt;

  } catch (err) {
    console.error('Image', repo, 'failed:', err.message);
    repo.error = err.message;
  }
}
console.table(repos, new Array<keyof Repo>(
  'imageName',
  'tagsBefore', 'gbBefore',
  'tagsDeleted', 'gbDeleted',
  'oldestBefore', 'oldestAfter',
  'error',
));

type Config = {
  repository: string;
  rule: Array<{
    image_patterns: string[];
    keep_count?: number;
    keep_days?: number;
    allow_tagged?: boolean;
    tag_filter?: string;
  }>;
};

type Repo = {
  imageName: string;
  tagsBefore?: number; tagsDeleted?: number;
  gbBefore?: number; gbDeleted?: number;
  oldestBefore?: Date; oldestAfter?: Date;
  error?: string;
};
