import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { auth } from 'express-oauth2-jwt-bearer';
import { promisify } from 'util';

@Injectable()
export class AuthGuard implements CanActivate {
  private checkJwt: any;

  constructor() {
    this.checkJwt = auth({
      audience: process.env.AUTH0_AUDIENCE,
      issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
      tokenSigningAlg: 'RS256',
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req, res } = ctx.getContext();

    try {
      await promisify(this.checkJwt)(req, res);
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or missing token');
    }
  }
}
