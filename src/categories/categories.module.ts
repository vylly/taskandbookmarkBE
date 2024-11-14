import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoryInGroup } from './entities/category-in-group.entity';
import { Category } from './entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupModule } from 'src/group/group.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category, CategoryInGroup]), GroupModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
