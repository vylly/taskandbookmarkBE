import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryInGroup } from './entities/category-in-group.entity';
import { DataSource, In, Repository } from 'typeorm';
import { GroupService } from 'src/group/group.service';
import { GetAllForGroupDto } from './dto/get-all-for-group.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { findBmIdsToUpdate } from './queries/update-queries';
import { BookmarkInCategory } from 'src/bookmarks/entities/bookmark-in-category.entity';
import { DeleteCategoryDto } from './dto/delete-category.dto';
import { findBmIdsToDelete } from './queries/delete-queries';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(CategoryInGroup)
    private readonly categoryInGroupRepository: Repository<CategoryInGroup>,
    @InjectRepository(BookmarkInCategory)
    private readonly bookmarkInCategoryRepository: Repository<BookmarkInCategory>,
    @InjectDataSource()
    private dataSource: DataSource,
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

  async update(updateCategoryDto: UpdateCategoryDto, user: any) {
    const userId = user.userId || user.id;
    const isUserEditorOrOwner = await this.groupService.isUserEditorOrOwner(
      userId,
      updateCategoryDto.groupid
    );
    if (!isUserEditorOrOwner) {
      return { code: 441, message: 'Not a member of the group' };
    }
    const catToUpdate = await this.categoryRepository.findOne({
      where: { id: updateCategoryDto.id },
    });
    if (!catToUpdate) {
      return { code: 445, message: 'Not category found' };
    }
    const existingCatInGroup = await this.categoryInGroupRepository.findOne({
      where: {
        groupid: updateCategoryDto.groupid,
        categoryid: updateCategoryDto.id,
      },
    });
    if (!existingCatInGroup) {
      return { code: 446, message: 'Not category in group found' };
    }
    const updCatInGroup = new CategoryInGroup();
    updCatInGroup.id = existingCatInGroup.id;
    updCatInGroup.color = updateCategoryDto.color;
    updCatInGroup.groupid = updateCategoryDto.groupid;
    if (catToUpdate.name === updateCategoryDto.name) {
      updCatInGroup.categoryid = updateCategoryDto.id;
      return await this.categoryInGroupRepository.save(updCatInGroup);
    }
    const newCat = new Category();
    newCat.name = updateCategoryDto.name;
    const newCatRes = await this.categoryRepository.save(newCat);
    updCatInGroup.categoryid = newCatRes.id;
    await this.categoryInGroupRepository.save(updCatInGroup);
    const bmIdsToUpdateRes: { id: number }[] = await this.dataSource.query(
      await findBmIdsToUpdate(updateCategoryDto.groupid, updateCategoryDto.id)
    );
    const bmIdsToUpdate = bmIdsToUpdateRes.map((res) => {
      return res.id;
    });
    const bmicToUpdate = await this.bookmarkInCategoryRepository.find({
      where: {
        bookmarkid: In(bmIdsToUpdate),
        categoryid: updateCategoryDto.id,
      },
    });
    const bmicUpdated = bmicToUpdate.map((bmic) => {
      return { ...bmic, categoryid: newCatRes.id };
    });
    return await this.bookmarkInCategoryRepository.save(bmicUpdated);
  }

  async delete(deleteCategoryDto: DeleteCategoryDto, user: any) {
    const userId = user.userId || user.id;
    const isUserEditorOrOwner = await this.groupService.isUserEditorOrOwner(
      userId,
      deleteCategoryDto.groupid
    );
    if (!isUserEditorOrOwner) {
      return { code: 441, message: 'Not a member of the group' };
    }
    const catToUpdate = await this.categoryRepository.findOne({
      where: { id: deleteCategoryDto.id },
    });
    if (!catToUpdate) {
      return { code: 445, message: 'Not category found' };
    }
    const existingCatInGroups = await this.categoryInGroupRepository.count({
      where: {
        categoryid: deleteCategoryDto.id,
      },
    });
    if (!existingCatInGroups || existingCatInGroups < 1) {
      return { code: 446, message: 'Not category in groups found' };
    }

    const existingCatInGroup = await this.categoryInGroupRepository.findOne({
      where: {
        categoryid: deleteCategoryDto.id,
        groupid: deleteCategoryDto.groupid,
      },
    });
    if (!existingCatInGroup) {
      return { code: 446, message: 'Not category in group found' };
    }

    //search for bm in group using this category
    const bmIdsToDeleteRes: { id: number }[] = await this.dataSource.query(
      await findBmIdsToDelete(deleteCategoryDto.groupid, deleteCategoryDto.id)
    );
    const bmIdsToDelete = bmIdsToDeleteRes.map((res) => {
      return res.id;
    });

    if (bmIdsToDelete.length) {
      return {
        code: 447,
        message: 'Cannot delete categories bound to used bookmarks',
      };
    }

    //delete category in group for current group
    const cigToDelete = await this.categoryInGroupRepository.findOne({
      where: {
        categoryid: deleteCategoryDto.id,
        groupid: deleteCategoryDto.groupid,
      },
    });
    const res = await this.categoryInGroupRepository.remove(cigToDelete);
    // category is used by multiple groups including this one -> do nothing more
    if (existingCatInGroup && existingCatInGroups > 1) {
      return res;
    }

    //category is used only by current group -> delete category
    const catToRemove = await this.categoryRepository.findOne({
      where: {
        id: deleteCategoryDto.id,
      },
    });
    return await this.categoryRepository.remove(catToRemove);
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
