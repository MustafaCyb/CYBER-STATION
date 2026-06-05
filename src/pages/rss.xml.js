import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const articles = (await getCollection('articles', (a) => a.data.locale === 'en' && !a.data.draft))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: 'Cyber Station',
    description: 'Cybersecurity research hub — tools, articles, and lecture presentations.',
    site: context.site,
    items: articles.map((article) => ({
      title: article.data.title,
      description: article.data.description,
      pubDate: article.data.date,
      link: `/CYBER-STATION/en/articles/${article.data.itemSlug}/`,
    })),
  });
}
