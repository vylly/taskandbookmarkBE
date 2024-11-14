import { Controller, Post, Body, Request } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetAllForGroupDto } from './dto/get-all-for-group.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('createCategory')
  create(@Body() createCategoryDto: CreateCategoryDto, @Request() req) {
    return this.categoriesService.create(createCategoryDto, req.user);
  }

  @Post('getAllCategoriesForGroup')
  getAllForGroup(@Body() getAllForGroupDto: GetAllForGroupDto, @Request() req) {
    return this.categoriesService.getAllForGroup(getAllForGroupDto, req.user);
  }
}
