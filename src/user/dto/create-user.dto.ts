import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  // Matches,
  MinLength,
} from 'class-validator';

// const passwordRegEx =
//   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(3, { message: 'Username must have atleast 3 characters.' })
  @IsAlphanumeric(undefined, {
    message: 'Username does not allow other than alpha numeric chars.',
  })
  username: string;

  @IsNotEmpty()
  @IsEmail(undefined, { message: 'Please provide valid Email.' })
  email: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'Password must have atleast 8 characters.' })
  password: string;
}
