import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ShittyAuthGuard extends AuthGuard('local') {}
