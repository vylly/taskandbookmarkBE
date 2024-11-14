import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateBookmarkDto {
  @IsNotEmpty()
  groupid: number;

  @IsNotEmpty()
  categories: number[];

  @IsNotEmpty()
  @MinLength(3, { message: 'Category name must have atleast 3 characters.' })
  title: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  description: string;
}
