import { IsNumber } from "class-validator";

export class BanUserDto {
    @IsNumber()
    bancount: number;
}