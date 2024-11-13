import { IsNotEmpty } from 'class-validator';

export class JoinGroupDTO {
  @IsNotEmpty()
  shareToken: string;
}
