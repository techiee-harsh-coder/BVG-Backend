import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { AccessToken, AccessTokenDocument } from '../schema/access-token.schema';
import { getModelToken, InjectModel } from '@nestjs/mongoose';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class CustomerGuard implements CanActivate {
  constructor(
    private jwtService:JwtService,
          private moduleRef: ModuleRef

  ){}
  private accessTokenModel: Model<AccessTokenDocument>;
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = this.jwtService.verify(token);
      const isBlacklisted = await this.isActive(token);

      if (!isBlacklisted) {
        throw new UnauthorizedException('Token is blacklisted');
      }

      request.user = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
  async isActive(token: string): Promise<boolean> {
        if (!this.accessTokenModel) {
          this.accessTokenModel = this.moduleRef.get<Model<AccessTokenDocument>>(getModelToken(AccessToken.name), { strict: false });
        }
      const accessToken = await this.accessTokenModel.findOne({ accessToken:token,userType:'customer'  });
    return !!accessToken;
  }
}
