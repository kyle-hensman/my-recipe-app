import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const expectedApiKey = this.configService.get<string>(
      'CLIENT_SECRET_API_KEY',
    );

    const authHeader = request.headers['authorization'] as string;
    if (!authHeader) {
      return false;
    }

    const apiKey = authHeader.split(' ')[1];
    if (!apiKey) {
      return false;
    }

    if (apiKey && apiKey === expectedApiKey) {
      return true;
    } else {
      return false;
    }
  }
}
