import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateAuthDto {
    email: string;
    password: string;
}

export class DataLoginDto{
    @IsEmail()
    email: string

    @IsNotEmpty()
    password: string
}
