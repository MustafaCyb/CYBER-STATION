export const ui: Record<string, Record<string, string>> = {
  en: {
    siteTitle: 'CYBER STATION',
    siteDescription: 'Cybersecurity research, tools, articles, and lecture presentations.',
    home: 'Home',
    articles: 'Articles',
    projects: 'Projects',
    presentations: 'Presentations',
    tags: 'Tags',
    about: 'About',
    readMore: 'Read More',
    viewProject: 'View Project',
    viewSlides: 'View Slides',
    viewOnGithub: 'View on GitHub',
    allProjects: 'All Projects',
    allArticles: 'All Articles',
    allPresentations: 'All Presentations',
    allTags: 'All Tags',
    featuredProjects: 'Featured Projects',
    latestArticles: 'Latest Articles',
    recentPresentations: 'Recent Presentations',
    heroTitle: 'CYBER STATION',
    heroSubtitle: 'Cybersecurity research hub — tools, articles, and lecture presentations.',
    exploreProjects: 'Explore Projects',
    readArticles: 'Read Articles',
    prev: 'Previous',
    next: 'Next',
    minRead: 'min read',
    filterAll: 'All',
    noResults: 'No items found.',
    session: 'Session',
    aboutTitle: 'About CYBER STATION',
    aboutDesc: 'A cybersecurity learning and research platform focused on offensive security, digital forensics, and security tool development.',
    switchLang: 'العربية',
    projectsCount: 'Projects',
    presentationsCount: 'Presentations',
    articlesCount: 'Articles',
    defensive: 'Defensive',
    educationalOnly: 'Educational Only',
    authorizedTestingOnly: 'Authorized Testing',
    active: 'Active',
    wip: 'In Progress',
    archived: 'Archived',
    taggedWith: 'Tagged with',
  },
  ar: {
    siteTitle: 'CYBER STATION',
    siteDescription: 'أبحاث الأمن السيبراني، أدوات، مقالات، وعروض تقديمية.',
    home: 'الرئيسية',
    articles: 'المقالات',
    projects: 'المشاريع',
    presentations: 'العروض التقديمية',
    tags: 'الوسوم',
    about: 'حول',
    readMore: 'اقرأ المزيد',
    viewProject: 'عرض المشروع',
    viewSlides: 'عرض الشرائح',
    viewOnGithub: 'عرض على GitHub',
    allProjects: 'جميع المشاريع',
    allArticles: 'جميع المقالات',
    allPresentations: 'جميع العروض التقديمية',
    allTags: 'جميع الوسوم',
    featuredProjects: 'المشاريع المميزة',
    latestArticles: 'أحدث المقالات',
    recentPresentations: 'العروض الأخيرة',
    heroTitle: 'CYBER STATION',
    heroSubtitle: 'مركز أبحاث الأمن السيبراني — أدوات، مقالات، وعروض تقديمية.',
    exploreProjects: 'استكشف المشاريع',
    readArticles: 'اقرأ المقالات',
    prev: 'السابق',
    next: 'التالي',
    minRead: 'دقيقة للقراءة',
    filterAll: 'الكل',
    noResults: 'لم يتم العثور على عناصر.',
    session: 'الجلسة',
    aboutTitle: 'حول CYBER STATION',
    aboutDesc: 'منصة تعلم وأبحاث في الأمن السيبراني تركز على الأمن الهجومي، الطب الشرعي الرقمي، وتطوير أدوات الأمان.',
    switchLang: 'English',
    projectsCount: 'مشاريع',
    presentationsCount: 'عروض',
    articlesCount: 'مقالات',
    defensive: 'دفاعي',
    educationalOnly: 'تعليمي فقط',
    authorizedTestingOnly: 'اختبار مصرح',
    active: 'نشط',
    wip: 'قيد التطوير',
    archived: 'مؤرشف',
    taggedWith: 'موسوم بـ',
  },
};

export function t(locale: string, key: string): string {
  return ui[locale]?.[key] ?? ui['en']?.[key] ?? key;
}

export function getLocaleFromPath(path: string): string {
  const segments = path.split('/').filter(Boolean);
  const base = 'CYBER-STATION';
  const afterBase = segments.indexOf(base);
  const langIndex = afterBase >= 0 ? afterBase + 1 : 0;
  const lang = segments[langIndex];
  return lang === 'ar' ? 'ar' : 'en';
}

export function getAlternatePath(currentPath: string, targetLocale: string): string {
  const current = currentPath.replace(/\/$/, '');
  if (targetLocale === 'ar') {
    return current.replace(/\/en(\/|$)/, '/ar$1');
  }
  return current.replace(/\/ar(\/|$)/, '/en$1');
}
