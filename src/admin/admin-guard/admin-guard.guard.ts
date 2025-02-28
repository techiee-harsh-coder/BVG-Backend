import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import {  AccessTokenDocument } from 'src/v1/customers/schema/access-token.schema';

@Injectable()
export class AdminGuard implements CanActivate {
   constructor(
      private jwtService:JwtService,
  
    ){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
  
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return false;
      }
  
      const token = authHeader.split(' ')[1];
  
      try {
        const decoded = this.jwtService.verify(token);
  
        request.user = decoded;
        request.userId = decoded._id;
        return true;
      } catch (error) {
        throw new UnauthorizedException('Invalid or expired token');
      }
    }
}
