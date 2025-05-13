import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { Public } from 'src/common/decorators/public.decorator';

@Public()
@Controller('pages/auth')
export class AuthPagesController {
    @Get('login')
    getLogin(@Res() res: Response) {
        res.sendFile(join(__dirname, '..', '..', 'front', 'src', 'html', 'auth', 'login.html'));
    }

    @Get('register')
    getRegister(@Res() res: Response) {
        res.sendFile(join(__dirname, '..', '..', 'front', 'src', 'html', 'auth', 'register.html'));
    }
}
