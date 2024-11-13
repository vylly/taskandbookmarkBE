import { IsNotEmpty } from 'class-validator';

export class GetGroupDTO {
  @IsNotEmpty()
  id: number;
}
