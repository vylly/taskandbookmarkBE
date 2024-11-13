import { Controller, Request, Post, Body, Get } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { GetGroupDTO } from './dto/get-group.dto';
import { JoinGroupDTO } from './dto/join-group.dto';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post('createGroup')
  create(@Body() createGroupDto: CreateGroupDto, @Request() req) {
    return this.groupService.create(createGroupDto, req.user);
  }

  @Get('getAll')
  getAllForUser(@Request() req) {
    return this.groupService.getAllForUser(req.user);
  }

  @Post('getGroup')
  getGroup(@Body() getGroupDTO: GetGroupDTO, @Request() req) {
    return this.groupService.getGroup(getGroupDTO, req.user);
  }

  @Post('joinGroup')
  joinGroup(@Body() joinGroupDTO: JoinGroupDTO, @Request() req) {
    return this.groupService.joinGroup(joinGroupDTO, req.user);
  }
}
