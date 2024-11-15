import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { Owner } from './entities/owner.entity';
import { Editor } from './entities/editor.entity';
import { GetGroupDTO } from './dto/get-group.dto';
import { uid } from 'uid';
import { JoinGroupDTO } from './dto/join-group.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Owner)
    private readonly ownerRepository: Repository<Owner>,
    @InjectRepository(Editor)
    private readonly editorRepository: Repository<Editor>
  ) {}

  async create(createGroupDto: CreateGroupDto, user: any) {
    const userId = user.userId || user.id;
    const group: Group = new Group();
    group.name = createGroupDto.name;
    group.shareToken = uid(15);
    const owner: Owner = new Owner();
    owner.userid = userId;
    const res = await this.groupRepository.save(group);
    owner.groupid = res.id;
    await this.ownerRepository.save(owner);
    return res;
  }

  async getAllForUser(user: any) {
    const userId = user.userId || user.id;

    const whereOwner = (
      await this.ownerRepository.findBy({ userid: userId })
    ).map((owner) => {
      return owner.groupid;
    });
    const whereEditor = (
      await this.editorRepository.findBy({ userid: userId })
    ).map((editor) => {
      return editor.groupid;
    });
    const allGroups = [...whereEditor, ...whereOwner];
    return await this.groupRepository.findBy({ id: In(allGroups) });
  }

  async getGroup(getGroupDTO: GetGroupDTO, user: any) {
    const userId = user.userId || user.id;
    const whereOwner = (
      await this.ownerRepository.findBy({
        userid: userId,
        groupid: getGroupDTO.id,
      })
    ).map((owner) => {
      return owner.groupid;
    });
    const whereEditor = (
      await this.editorRepository.findBy({
        userid: userId,
        groupid: getGroupDTO.id,
      })
    ).map((editor) => {
      return editor.groupid;
    });
    const allGroups = [...whereEditor, ...whereOwner];
    if (!allGroups.length) {
      return { code: 460, message: 'ressource not available' };
    }
    const res = await this.groupRepository.findOne({
      where: { id: allGroups[0] },
    });
    return res;
  }

  async joinGroup(joinGroupDTO: JoinGroupDTO, user: any) {
    const userId = user.userId || user.id;
    const toJoin = await this.groupRepository.findOne({
      where: { shareToken: joinGroupDTO.shareToken },
    });
    if (!toJoin) {
      return { code: 470, message: 'No ground found' };
    }
    const isOwnerOrEditor = await this.isUserEditorOrOwner(userId, toJoin.id);
    if (isOwnerOrEditor) {
      return { code: 471, message: 'Already a member' };
    }

    const editor: Editor = new Editor();
    editor.userid = userId;
    editor.groupid = toJoin.id;
    await this.editorRepository.save(editor);
    return toJoin;
  }

  async isUserEditorOrOwner(userid: number, groupid: number) {
    const isOwner = await this.ownerRepository.findOne({
      where: {
        userid,
        groupid,
      },
    });
    const isEditor = await this.editorRepository.findOne({
      where: {
        userid,
        groupid,
      },
    });

    return isOwner || isEditor;
  }
}
