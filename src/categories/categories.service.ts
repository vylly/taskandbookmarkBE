import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryInGroup } from './entities/category-in-group.entity';
import { In, Repository } from 'typeorm';
import { GroupService } from 'src/group/group.service';
import { GetAllForGroupDto } from './dto/get-all-for-group.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(CategoryInGroup)
    private readonly categoryInGroupRepository: Repository<CategoryInGroup>,
    private groupService: GroupService
  ) {}

  async getAllForGroup(getAllForGroupDto: GetAllForGroupDto, user: any) {
    const userId = user.userId || user.id;
    const isUserEditorOrOwner = await this.groupService.isUserEditorOrOwner(
      userId,
      getAllForGroupDto.groupid
    );
    if (!isUserEditorOrOwner) {
      return { code: 441, message: 'Not a member of the group' };
    }
    const allCategoriesInGroup = await this.categoryInGroupRepository.findBy({
      groupid: getAllForGroupDto.groupid,
    });

    const allCategoriesIdsInGroup = allCategoriesInGroup.map((cat) => {
      return cat.categoryid;
    });

    const allCatRes = await this.categoryRepository.findBy({
      id: In(allCategoriesIdsInGroup),
    });

    const formatedRes = allCatRes.map((cat) => {
      const foundCat = allCategoriesInGroup.find((categ) => {
        return categ.categoryid === cat.id;
      });
      const color = foundCat.color;
      return { ...cat, color };
    });

    return formatedRes;
  }

  async create(createCategoryDto: CreateCategoryDto, user: any) {
    const userId = user.userId || user.id;
    const isUserEditorOrOwner = await this.groupService.isUserEditorOrOwner(
      userId,
      createCategoryDto.groupid
    );
    if (!isUserEditorOrOwner) {
      return { code: 441, message: 'Not a member of the group' };
    }
    const categoryExists = await this.categoryRepository.findOne({
      where: {
        name: createCategoryDto.name,
      },
    });

    const categoryInGroup: CategoryInGroup = new CategoryInGroup();
    categoryInGroup.groupid = createCategoryDto.groupid;
    categoryInGroup.color = createCategoryDto.color;

    if (categoryExists) {
      categoryInGroup.categoryid = categoryExists.id;
      const resCatInGrp =
        await this.categoryInGroupRepository.save(categoryInGroup);
      return resCatInGrp;
    }

    const newCategory: Category = new Category();
    newCategory.name = createCategoryDto.name;
    const newCatRes = await this.categoryRepository.save(newCategory);
    categoryInGroup.categoryid = newCatRes.id;
    await this.categoryInGroupRepository.save(categoryInGroup);

    return { ...newCatRes, color: createCategoryDto.color };
  }

  async areCategoriesInGroup(categoriesId: number[], groupid: number) {
    const areCategoriesInGroup = await this.categoryInGroupRepository.find({
      where: {
        categoryid: In(categoriesId),
        groupid,
      },
    });

    return (
      areCategoriesInGroup &&
      areCategoriesInGroup.length === categoriesId.length
    );
  }
}
