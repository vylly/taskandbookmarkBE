import { IsNotEmpty } from 'class-validator';

export class GetAllForGroupDto {
  @IsNotEmpty()
  groupid: number;
}
