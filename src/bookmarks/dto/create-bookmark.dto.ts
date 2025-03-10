import { IsNotEmpty } from 'class-validator';

export class CreateBookmarkDto {
  @IsNotEmpty()
  groupid: number;

  @IsNotEmpty()
  categories: number[];

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  description: string;
}
