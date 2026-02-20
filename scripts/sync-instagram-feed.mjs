import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const username = 'box_club_col';
const limit = 6;
const outDir = join(process.cwd(), 'public', 'instagram-feed');
const outJson = join(process.cwd(), 'src', 'data', 'instagram-feed.json');
const cacheJson = join(process.cwd(), 'src', 'data', 'instagram-profile-cache.json');

const profileUrl = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`;

async function fetchJson(url, headers = {}) {
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`Request failed ${res.status} ${res.statusText}: ${url}`);
  }
  return res.json();
}

async function fetchBuffer(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0'
    }
  });
  if (!res.ok) {
    throw new Error(`Image download failed ${res.status} ${res.statusText}: ${url}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function formatCaption(rawCaption) {
  const cleaned = rawCaption.replace(/\s+/g, ' ').trim();
  if (!cleaned) {
    return '';
  }

  const maxLength = 140;
  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  const sliced = cleaned.slice(0, maxLength);
  const lastSpace = sliced.lastIndexOf(' ');
  const safe = lastSpace > 90 ? sliced.slice(0, lastSpace) : sliced;
  return `${safe.trim()}...`;
}

async function main() {
  await mkdir(outDir, { recursive: true });

  let data;
  try {
    data = await fetchJson(profileUrl, {
      'User-Agent': 'Mozilla/5.0',
      'x-ig-app-id': '936619743392459'
    });
    await writeFile(cacheJson, JSON.stringify(data, null, 2) + '\n');
  } catch (error) {
    const cached = await readFile(cacheJson, 'utf8').catch(() => null);
    if (!cached) {
      throw error;
    }
    data = JSON.parse(cached);
    console.warn('Using cached Instagram profile data from src/data/instagram-profile-cache.json');
  }

  const edges = data?.data?.user?.edge_owner_to_timeline_media?.edges ?? [];
  const selected = edges.slice(0, limit);

  const posts = [];

  for (const edge of selected) {
    const node = edge.node;
    const shortcode = node.shortcode;
    const imageUrl = node.display_url;
    const caption = node.edge_media_to_caption?.edges?.[0]?.node?.text ?? '';
    const localFile = `${shortcode}.jpg`;
    const localPath = join(outDir, localFile);

    const bytes = await fetchBuffer(imageUrl);
    await writeFile(localPath, bytes);

    posts.push({
      shortcode,
      postUrl: `https://www.instagram.com/p/${shortcode}/`,
      image: `instagram-feed/${localFile}`,
      caption: formatCaption(caption)
    });
  }

  await writeFile(outJson, JSON.stringify(posts, null, 2) + '\n');
  console.log(`Saved ${posts.length} posts to ${outJson}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
