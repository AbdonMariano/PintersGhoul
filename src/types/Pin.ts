export interface Pin {
  id: string;
  imageUri: string | number; // string (remota) o number (require local)
  title: string;
  description: string;
  author: string;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
}
