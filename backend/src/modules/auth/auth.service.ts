import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async register(registerDto: RegisterDto) {
        const existing = await this.usersService.findByEmail(registerDto.email);
        if (existing) {
            throw new ConflictException('Email already registered');
        }

        const saltRounds = 10;
        const hashed = await bcrypt.hash(registerDto.password, saltRounds);

        const createDto: CreateUserDto = {
            email: registerDto.email,
            password: hashed,
            firstName: registerDto.firstName,
            lastName: "N/A",
            role: registerDto.role,
        };

        const user = await this.usersService.create(createDto);

        // Remove password before return
        // Prisma returns password field unless select omitted; create returns full by default
        // Build safe user object:
        const { password, ...safeUser } = user as any;
        return safeUser;
    }

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const match = await bcrypt.compare(loginDto.password, (user as any).password);
        if (!match) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        const token = this.jwtService.sign(payload);

        // Remove password before returning user
        const { password, ...safeUser } = user as any;

        return {
            access_token: token,
            user: safeUser,
        };
    }

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) return null;

        const match = await bcrypt.compare(password, (user as any).password);
        if (!match) return null;

        const { password: _p, ...safeUser } = user as any;
        return safeUser;
    }
}
