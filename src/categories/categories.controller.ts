import { Controller, Post, Body, Request } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetAllForGroupDto } from './dto/get-all-for-group.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DeleteCategoryDto } from './dto/delete-category.dto';

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

  @Post('updateCategory')
  update(@Body() updateCategoryDto: UpdateCategoryDto, @Request() req) {
    return this.categoriesService.update(updateCategoryDto, req.user);
  }

  @Post('deleteCategory')
  delete(@Body() deleteCategoryDto: DeleteCategoryDto, @Request() req) {
    return this.categoriesService.delete(deleteCategoryDto, req.user);
  }
}
