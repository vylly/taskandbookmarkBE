import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Owner } from './entities/owner.entity';
import { Group } from './entities/group.entity';
import { Editor } from './entities/editor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Group, Owner, Editor])],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule {}
