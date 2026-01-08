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

export class DataChangePassword{
    @IsNotEmpty()
    oldPassword: string

    @IsNotEmpty()
    newPassword: string
}

export class forgotPasswordDto{
    @IsNotEmpty()
    email: string
}

export class verifyTokenDto{
    @IsEmail()
    email: string

    @IsNotEmpty()
    token: string
}

export class resetPassword{
    @IsEmail()
    email: string

    @IsNotEmpty()
    newPassword: string
}