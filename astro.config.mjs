import { defineConfig } from 'astro/config';

const repositorySlug = process.env.GITHUB_REPOSITORY ?? '';
const [owner = 'your-username', repo = ''] = repositorySlug.split('/');
const isUserSiteRepo = repo.endsWith('.github.io');
const SITE = `https://${owner}.github.io`;
const PROD_BASE = repo && !isUserSiteRepo ? `/${repo}/` : '/';
const BASE = process.env.NODE_ENV === 'development' ? '/' : PROD_BASE;

export default defineConfig({
  site: SITE,
  base: BASE,
  output: 'static'
});
