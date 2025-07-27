// src/common/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const jwtService = new JwtService(); // Ensure JwtService is available
    const request = ctx.switchToHttp().getRequest();
    const authorization = request.headers?.authorization;
    console.log("Current user:", authorization);
    const decoded = authorization ? jwtService.decode(authorization) : null;
    return decoded.payload;;
  },
);
// This decorator can be used to access the current user in controllers