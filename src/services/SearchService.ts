// Visual Search Engine for Tokyo Ghoul content
export class SearchService {
  private static keywords = [
    'kaneki', 'tokyo ghoul', 'ghoul', 'anime', 'manga',
    'kagune', 'mask', 'transformation', 'touka', 'hide',
    'art', 'wallpaper', 'cosplay', 'fanart', 'drawing',
    'character', 'scene', 'epic', 'dark', 'red eyes'
  ];

  private static categories: { [key: string]: string[] } = {
    'kaneki': ['kaneki ken', 'white hair', 'ghoul form', 'transformation'],
    'ghoul': ['ghoul mask', 'kagune', 'red eyes', 'dark theme'],
    'art': ['fanart', 'drawing', 'illustration', 'digital art'],
    'cosplay': ['costume', 'makeup', 'photography', 'character'],
    'manga': ['panels', 'pages', 'black and white', 'comic'],
    'anime': ['screenshots', 'scenes', 'episodes', 'moments']
  };

  static searchByKeywords(query: string): string[] {
    const normalizedQuery = query.toLowerCase();
    const results: string[] = [];
    
    // Direct keyword matches
    this.keywords.forEach(keyword => {
      if (normalizedQuery.includes(keyword)) {
        results.push(keyword);
      }
    });

    // Category-based search
    Object.entries(this.categories).forEach(([category, terms]) => {
      if (normalizedQuery.includes(category)) {
        results.push(...terms);
      }
    });

    return [...new Set(results)]; // Remove duplicates
  }

  static getSearchSuggestions(partialQuery: string): string[] {
    const normalizedQuery = partialQuery.toLowerCase();
    return this.keywords.filter(keyword => 
      keyword.includes(normalizedQuery) || normalizedQuery.includes(keyword)
    ).slice(0, 5);
  }

  static getTrendingSearches(): string[] {
    return [
      'kaneki transformation',
      'tokyo ghoul wallpaper',
      'ghoul mask cosplay',
      'kagune art',
      'touka fanart'
    ];
  }

  static getCategoryKeywords(category: string): string[] {
    return this.categories[category] || [];
  }
}
