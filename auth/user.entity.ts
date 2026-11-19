export class UserEntity {
  id: string;
  name: string;
  email: string;
  role: 'guest' | 'customer' | 'moderator' | 'brand-admin';
  trustScore: number;
  createdAt: Date;
}
