import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { CurrentUser as ICurrentUser } from '../../auth/interfaces/jwt-payload.interface';

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): ICurrentUser => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);
