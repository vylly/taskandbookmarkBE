import { IsNotEmpty } from 'class-validator';

export class UpdateBookmarkDto {
  @IsNotEmpty()
  id: number;

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
