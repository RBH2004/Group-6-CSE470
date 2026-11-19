import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  validateUser(email: string, password: string) {
    if (!email || !password) {
      return null;
    }

    return {
      id: 'u-1',
      name: 'Demo Customer',
      email,
      role: 'customer',
    };
  }
}
