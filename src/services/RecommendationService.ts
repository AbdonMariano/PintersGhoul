// Recommendation Algorithm for Tokyo Ghoul content
export class RecommendationService {
  private static userInterests: string[] = [];
  private static savedPins: string[] = [];
  private static searchHistory: string[] = [];

  static updateUserInterests(interests: string[]) {
    this.userInterests = interests;
  }

  static addSavedPin(pinId: string) {
    this.savedPins.push(pinId);
  }

  static addSearchQuery(query: string) {
    this.searchHistory.push(query);
  }

  static getPersonalizedFeed(allPins: any[]): any[] {
    // Algorithm based on user behavior
    const scoredPins = allPins.map(pin => ({
      ...pin,
      score: this.calculatePinScore(pin)
    }));

    // Sort by score (highest first)
    return scoredPins
      .sort((a, b) => b.score - a.score)
      .slice(0, 20); // Top 20 recommendations
  }

  private static calculatePinScore(pin: any): number {
    let score = 0;

    // Base score
    score += 1;

    // Interest-based scoring
    this.userInterests.forEach(interest => {
      if (pin.title.toLowerCase().includes(interest.toLowerCase()) ||
          pin.description.toLowerCase().includes(interest.toLowerCase())) {
        score += 3;
      }
    });

    // Search history relevance
    this.searchHistory.forEach(query => {
      if (pin.title.toLowerCase().includes(query.toLowerCase()) ||
          pin.description.toLowerCase().includes(query.toLowerCase())) {
        score += 2;
      }
    });

    // Popularity boost
    score += pin.likes * 0.1;

    // Recency boost (newer pins get slight boost)
    const daysSinceCreated = (Date.now() - new Date(pin.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24);
    score += Math.max(0, 7 - daysSinceCreated) * 0.2;

    // Author following boost
    if (this.isFollowingAuthor(pin.author)) {
      score += 2;
    }

    return score;
  }

  private static isFollowingAuthor(author: string): boolean {
    // Mock function - in real app, check user's following list
    return ['TokyoGhoulFan', 'AnimeArtist', 'MangaReader'].includes(author);
  }

  static getRelatedPins(currentPin: any, allPins: any[]): any[] {
    const relatedPins = allPins.filter(pin => 
      pin.id !== currentPin.id &&
      (pin.title.toLowerCase().includes(currentPin.title.toLowerCase()) ||
       pin.description.toLowerCase().includes(currentPin.description.toLowerCase()) ||
       pin.author === currentPin.author)
    );

    return relatedPins.slice(0, 6);
  }

  static getTrendingPins(allPins: any[]): any[] {
    return allPins
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 10);
  }

  static getNewPins(allPins: any[]): any[] {
    return allPins
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 10);
  }
}
