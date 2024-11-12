import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateGroupDto {
  @IsNotEmpty()
  @MinLength(3, { message: 'Group name must have atleast 3 characters.' })
  name: string;
}
