// Board Management System for organizing Pins
export interface Board {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  pinCount: number;
  isPrivate: boolean;
  collaborators: string[];
  createdAt: string;
  updatedAt: string;
  category: string;
}

export class BoardService {
  private static boards: Board[] = [
    {
      id: '1',
      name: 'Kaneki Collection',
      description: 'Los mejores pins de Kaneki Ken',
      coverImage: 'https://i.pinimg.com/564x/8a/4b/2a/8a4b2a1c3f5e7d9b8c6a4e2f1d3c5b7a.jpg',
      pinCount: 45,
      isPrivate: false,
      collaborators: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: 'kaneki'
    },
    {
      id: '2',
      name: 'Tokyo Ghoul Art',
      description: 'Arte inspirado en Tokyo Ghoul',
      coverImage: 'https://i.pinimg.com/564x/7b/3c/9d/7b3c9d2e4f6a8c1b9d7e5f3a2c4b6d8e.jpg',
      pinCount: 32,
      isPrivate: false,
      collaborators: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: 'art'
    },
    {
      id: '3',
      name: 'Ghoul Cosplay',
      description: 'Ideas de cosplay de Tokyo Ghoul',
      coverImage: 'https://i.pinimg.com/564x/9c/5d/4e/9c5d4e3f7a8b2c1d9e6f4a3c5b7d9e1f.jpg',
      pinCount: 28,
      isPrivate: false,
      collaborators: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: 'cosplay'
    }
  ];

  static getAllBoards(): Board[] {
    return this.boards;
  }

  static getBoardById(id: string): Board | undefined {
    return this.boards.find(board => board.id === id);
  }

  static createBoard(boardData: Omit<Board, 'id' | 'createdAt' | 'updatedAt' | 'pinCount'>): Board {
    const newBoard: Board = {
      ...boardData,
      id: Date.now().toString(),
      pinCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.boards.push(newBoard);
    return newBoard;
  }

  static updateBoard(id: string, updates: Partial<Board>): Board | null {
    const boardIndex = this.boards.findIndex(board => board.id === id);
    if (boardIndex === -1) return null;

    this.boards[boardIndex] = {
      ...this.boards[boardIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return this.boards[boardIndex];
  }

  static deleteBoard(id: string): boolean {
    const boardIndex = this.boards.findIndex(board => board.id === id);
    if (boardIndex === -1) return false;

    this.boards.splice(boardIndex, 1);
    return true;
  }

  static addPinToBoard(boardId: string, pinId: string): boolean {
    const board = this.getBoardById(boardId);
    if (!board) return false;

    board.pinCount += 1;
    board.updatedAt = new Date().toISOString();
    return true;
  }

  static removePinFromBoard(boardId: string, pinId: string): boolean {
    const board = this.getBoardById(boardId);
    if (!board) return false;

    board.pinCount = Math.max(0, board.pinCount - 1);
    board.updatedAt = new Date().toISOString();
    return true;
  }

  static addCollaborator(boardId: string, userId: string): boolean {
    const board = this.getBoardById(boardId);
    if (!board) return false;

    if (!board.collaborators.includes(userId)) {
      board.collaborators.push(userId);
      board.updatedAt = new Date().toISOString();
    }
    return true;
  }

  static removeCollaborator(boardId: string, userId: string): boolean {
    const board = this.getBoardById(boardId);
    if (!board) return false;

    board.collaborators = board.collaborators.filter(id => id !== userId);
    board.updatedAt = new Date().toISOString();
    return true;
  }

  static getBoardsByCategory(category: string): Board[] {
    return this.boards.filter(board => board.category === category);
  }

  static searchBoards(query: string): Board[] {
    const normalizedQuery = query.toLowerCase();
    return this.boards.filter(board =>
      board.name.toLowerCase().includes(normalizedQuery) ||
      board.description.toLowerCase().includes(normalizedQuery)
    );
  }
}
