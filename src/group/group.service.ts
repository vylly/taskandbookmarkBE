import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { Owner } from './entities/owner.entity';

@Injectable()
export class GroupService {
  createGroupDto: any;
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Owner)
    private readonly ownerRepository: Repository<Owner>
  ) {}

  async create(createGroupDto: CreateGroupDto, user: any) {
    const group: Group = new Group();
    group.name = createGroupDto.name;
    const owner: Owner = new Owner();
    owner.userid = user.userId;
    const res = await this.groupRepository.save(group);
    owner.groupid = res.id;
    await this.ownerRepository.save(owner);
    return res;
  }
}
