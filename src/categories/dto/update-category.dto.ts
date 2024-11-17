import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdateCategoryDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  groupid: number;

  @IsNotEmpty()
  color: string;
}
