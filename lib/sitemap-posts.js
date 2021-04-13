const fs = require('fs');
const fetch = require('node-fetch');
const prettier = require('prettier');

const getDate = new Date().toISOString();

const fetchUrl = 'https://tech.dpot.xyz/api/post';
const YOUR_AWESOME_DOMAIN = 'https://tech.dpot.xyz';

const formatted = (sitemap) => prettier.format(sitemap, { parser: 'html' });

(async () => {
  const fetchPosts = await fetch(fetchUrl)
    .then((res) => res.json())
    .catch((err) => console.log(err));

  const postList = [];
  fetchPosts.forEach((post) => postList.push(post.no));

  const postListSitemap = `
    ${postList
      .map((no) => {
        return `
          <url>
            <loc>${`${YOUR_AWESOME_DOMAIN}/post/${no}`}</loc>
            <lastmod>${getDate}</lastmod>
          </url>`;
      })
      .join('')}
  `;

  const generatedSitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
    >
      ${postListSitemap}
    </urlset>
  `;

  const formattedSitemap = [formatted(generatedSitemap)];

  fs.writeFileSync(
    '/home/centos/tech_blog_publish/public/sitemap/sitemap-posts.xml',
    formattedSitemap,
    'utf8',
  );
})();
