"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenGuard = void 0;
const passport_1 = require("@nestjs/passport");
const graphql_1 = require("@nestjs/graphql");
class RefreshTokenGuard extends (0, passport_1.AuthGuard)('jwt-refresh') {
    constructor() {
        super();
    }
    getRequest(context) {
        const ctx = graphql_1.GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }
}
exports.RefreshTokenGuard = RefreshTokenGuard;
//# sourceMappingURL=refreshToken.guard.js.map