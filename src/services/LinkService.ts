// External Links System for Tokyo Ghoul content
export interface ExternalLink {
  id: string;
  url: string;
  title: string;
  description: string;
  domain: string;
  favicon?: string;
  category: 'shop' | 'blog' | 'video' | 'tutorial' | 'official' | 'fanart';
  isVerified: boolean;
  createdAt: string;
}

export interface ShopItem {
  id: string;
  name: string;
  price: string;
  currency: string;
  image: string;
  shopUrl: string;
  shopName: string;
  availability: 'in_stock' | 'out_of_stock' | 'limited';
  rating?: number;
  reviews?: number;
}

export class LinkService {
  private static externalLinks: ExternalLink[] = [
    {
      id: '1',
      url: 'https://tokyoghoul.fandom.com/wiki/Kaneki_Ken',
      title: 'Kaneki Ken - Tokyo Ghoul Wiki',
      description: 'Información completa sobre Kaneki Ken en la wiki oficial',
      domain: 'tokyoghoul.fandom.com',
      category: 'official',
      isVerified: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      url: 'https://www.crunchyroll.com/tokyo-ghoul',
      title: 'Tokyo Ghoul en Crunchyroll',
      description: 'Ve Tokyo Ghoul completo en Crunchyroll',
      domain: 'crunchyroll.com',
      category: 'video',
      isVerified: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      url: 'https://www.redbubble.com/shop/tokyo+ghoul',
      title: 'Tokyo Ghoul Merchandise',
      description: 'Productos oficiales de Tokyo Ghoul',
      domain: 'redbubble.com',
      category: 'shop',
      isVerified: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      title: 'Tokyo Ghoul AMV - Epic Moments',
      description: 'Los mejores momentos de Tokyo Ghoul',
      domain: 'youtube.com',
      category: 'video',
      isVerified: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '5',
      url: 'https://www.deviantart.com/tokyo-ghoul-art',
      title: 'Tokyo Ghoul Fan Art Collection',
      description: 'Arte de fans increíble de Tokyo Ghoul',
      domain: 'deviantart.com',
      category: 'fanart',
      isVerified: false,
      createdAt: new Date().toISOString(),
    }
  ];

  private static shopItems: ShopItem[] = [
    {
      id: '1',
      name: 'Tokyo Ghoul Kaneki Ken Figure',
      price: '89.99',
      currency: 'USD',
      image: 'https://i.pinimg.com/564x/8a/4b/2a/8a4b2a1c3f5e7d9b8c6a4e2f1d3c5b7a.jpg',
      shopUrl: 'https://www.amazon.com/Tokyo-Ghoul-Kaneki-Figure/dp/B08XYZ123',
      shopName: 'Amazon',
      availability: 'in_stock',
      rating: 4.8,
      reviews: 1247,
    },
    {
      id: '2',
      name: 'Tokyo Ghoul Kagune Cosplay Mask',
      price: '45.50',
      currency: 'USD',
      image: 'https://i.pinimg.com/564x/7b/3c/9d/7b3c9d2e4f6a8c1b9d7e5f3a2c4b6d8e.jpg',
      shopUrl: 'https://www.etsy.com/listing/1234567890/tokyo-ghoul-mask',
      shopName: 'Etsy',
      availability: 'in_stock',
      rating: 4.6,
      reviews: 89,
    },
    {
      id: '3',
      name: 'Tokyo Ghoul Manga Collection',
      price: '199.99',
      currency: 'USD',
      image: 'https://i.pinimg.com/564x/9c/5d/4e/9c5d4e3f7a8b2c1d9e6f4a3c5b7d9e1f.jpg',
      shopUrl: 'https://www.barnesandnoble.com/w/tokyo-ghoul-manga/1234567890',
      shopName: 'Barnes & Noble',
      availability: 'limited',
      rating: 4.9,
      reviews: 2341,
    }
  ];

  static getAllLinks(): ExternalLink[] {
    return this.externalLinks;
  }

  static getLinksByCategory(category: string): ExternalLink[] {
    return this.externalLinks.filter(link => link.category === category);
  }

  static getVerifiedLinks(): ExternalLink[] {
    return this.externalLinks.filter(link => link.isVerified);
  }

  static addLink(link: Omit<ExternalLink, 'id' | 'createdAt'>): ExternalLink {
    const newLink: ExternalLink = {
      ...link,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    this.externalLinks.push(newLink);
    return newLink;
  }

  static getShopItems(): ShopItem[] {
    return this.shopItems;
  }

  static getShopItemsByAvailability(availability: string): ShopItem[] {
    return this.shopItems.filter(item => item.availability === availability);
  }

  static searchLinks(query: string): ExternalLink[] {
    const normalizedQuery = query.toLowerCase();
    return this.externalLinks.filter(link =>
      link.title.toLowerCase().includes(normalizedQuery) ||
      link.description.toLowerCase().includes(normalizedQuery) ||
      link.domain.toLowerCase().includes(normalizedQuery)
    );
  }

  static getDomainFavicon(domain: string): string {
    // Mock favicon URLs - in real app, you'd fetch these
    const faviconMap: { [key: string]: string } = {
      'tokyoghoul.fandom.com': 'https://static.wikia.nocookie.net/tokyoghoul/images/6/6f/Tokyo_Ghoul_logo.png',
      'crunchyroll.com': 'https://www.crunchyroll.com/favicon.ico',
      'redbubble.com': 'https://www.redbubble.com/favicon.ico',
      'youtube.com': 'https://www.youtube.com/favicon.ico',
      'deviantart.com': 'https://www.deviantart.com/favicon.ico',
      'amazon.com': 'https://www.amazon.com/favicon.ico',
      'etsy.com': 'https://www.etsy.com/favicon.ico',
      'barnesandnoble.com': 'https://www.barnesandnoble.com/favicon.ico',
    };
    return faviconMap[domain] || 'https://via.placeholder.com/32x32/666666/ffffff?text=?';
  }

  static validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static extractDomain(url: string): string {
    try {
      return new URL(url).hostname;
    } catch {
      return 'unknown';
    }
  }

  static getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'shop': '🛒',
      'blog': '📝',
      'video': '🎥',
      'tutorial': '📚',
      'official': '✅',
      'fanart': '🎨',
    };
    return icons[category] || '🔗';
  }

  static getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      'shop': '#FF6B6B',
      'blog': '#4ECDC4',
      'video': '#45B7D1',
      'tutorial': '#96CEB4',
      'official': '#FFEAA7',
      'fanart': '#DDA0DD',
    };
    return colors[category] || '#95A5A6';
  }
}
