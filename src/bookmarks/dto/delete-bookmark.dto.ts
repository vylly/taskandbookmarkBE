import { IsNotEmpty } from 'class-validator';

export class DeleteBookmarkDto {
  @IsNotEmpty()
  groupid: number;

  @IsNotEmpty()
  bookmarkid: number;
}
