import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @MinLength(3, { message: 'Category name must have atleast 3 characters.' })
  name: string;

  @IsNotEmpty()
  groupid: number;

  @IsNotEmpty()
  color: string;
}
