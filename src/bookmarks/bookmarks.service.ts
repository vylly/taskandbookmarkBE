import { Injectable } from '@nestjs/common';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { GroupService } from 'src/group/group.service';
import { InjectRepository } from '@nestjs/typeorm';
import { BookmarkInGroup } from './entities/bookmark-in-group.entity';
import { BookmarkInCategory } from './entities/bookmark-in-category.entity';
import { Bookmark } from './entities/bookmark.entity';
import { In, Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { GetAllForGroupDto } from './dto/get-all-for-group.dto';
import { DeleteBookmarkDto } from './dto/delete-bookmark.dto';
import { CategoryInGroup } from 'src/categories/entities/category-in-group.entity';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark)
    private readonly bookmarkRepository: Repository<Bookmark>,
    @InjectRepository(BookmarkInCategory)
    private readonly bookmarkInCategoryRepository: Repository<BookmarkInCategory>,
    @InjectRepository(BookmarkInGroup)
    private readonly bookmarkInGroupRepository: Repository<BookmarkInGroup>,
    @InjectRepository(CategoryInGroup)
    private readonly categoryInGroupRepository: Repository<CategoryInGroup>,
    private groupService: GroupService,
    private categoriesService: CategoriesService
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
    const allBMIdsInGroup = (
      await this.bookmarkInGroupRepository.findBy({
        groupid: getAllForGroupDto.groupid,
      })
    ).map((bm) => {
      return bm.bookmarkid;
    });

    const allBmRes = await this.bookmarkRepository.findBy({
      id: In(allBMIdsInGroup),
    });

    const resPromises = allBmRes.map(async (bm) => {
      const associatedCategory = await this.bookmarkInCategoryRepository.findBy(
        { bookmarkid: bm.id }
      );
      const associatedCategoryIds = associatedCategory.map((bmincat) => {
        return bmincat.categoryid;
      });
      return { ...bm, categories: associatedCategoryIds };
    });
    const res = await Promise.all(resPromises);
    return res;
  }

  async create(createBookmarkDto: CreateBookmarkDto, user: any) {
    const userId = user.userId || user.id;
    const isUserEditorOrOwner = await this.groupService.isUserEditorOrOwner(
      userId,
      createBookmarkDto.groupid
    );
    if (!isUserEditorOrOwner) {
      return { code: 441, message: 'Not a member of the group' };
    }
    const areCategoriesInGroup =
      await this.categoriesService.areCategoriesInGroup(
        createBookmarkDto.categories,
        createBookmarkDto.groupid
      );
    if (!areCategoriesInGroup) {
      return {
        code: 442,
        message: 'Some categories are not part of the group',
      };
    }
    const newBookmark: Bookmark = new Bookmark();
    newBookmark.title = createBookmarkDto.title;
    newBookmark.content = createBookmarkDto.content;
    newBookmark.type = createBookmarkDto.type;
    newBookmark.description = createBookmarkDto.description;
    const newBMRes = await this.bookmarkRepository.save(newBookmark);
    createBookmarkDto.categories.forEach(async (category) => {
      const newBookmarkInCategory: BookmarkInCategory =
        new BookmarkInCategory();
      newBookmarkInCategory.categoryid = category;
      newBookmarkInCategory.bookmarkid = newBMRes.id;
      await this.bookmarkInCategoryRepository.save(newBookmarkInCategory);
    });
    const newBookmarkInGroup: BookmarkInGroup = new BookmarkInGroup();
    newBookmarkInGroup.bookmarkid = newBMRes.id;
    newBookmarkInGroup.groupid = createBookmarkDto.groupid;
    await this.bookmarkInGroupRepository.save(newBookmarkInGroup);

    return { ...newBMRes, categories: createBookmarkDto.categories };
  }

  async updateBookmark(updateBookmarkDto: UpdateBookmarkDto, user: any) {
    const userId = user.userId || user.id;
    const isUserEditorOrOwner = await this.groupService.isUserEditorOrOwner(
      userId,
      updateBookmarkDto.groupid
    );
    if (!isUserEditorOrOwner) {
      return { code: 441, message: 'Not a member of the group' };
    }

    const areCategoriesInGroup =
      await this.categoriesService.areCategoriesInGroup(
        updateBookmarkDto.categories,
        updateBookmarkDto.groupid
      );
    if (!areCategoriesInGroup) {
      return {
        code: 442,
        message: 'Some categories are not part of the group',
      };
    }
    const updatedBm: Bookmark = new Bookmark();
    updatedBm.title = updateBookmarkDto.title;
    updatedBm.content = updateBookmarkDto.content;
    updatedBm.type = updateBookmarkDto.type;
    updatedBm.description = updateBookmarkDto.description;
    updatedBm.id = updateBookmarkDto.id;
    const updatedBmRes = await this.bookmarkRepository.save(updatedBm);

    const toRemoveBmInCat = await this.bookmarkInCategoryRepository.find({
      where: {
        bookmarkid: updateBookmarkDto.id,
      },
    });

    await this.bookmarkInCategoryRepository.remove(toRemoveBmInCat);

    updateBookmarkDto.categories.forEach(async (category) => {
      const newBookmarkInCategory: BookmarkInCategory =
        new BookmarkInCategory();
      newBookmarkInCategory.categoryid = category;
      newBookmarkInCategory.bookmarkid = updatedBm.id;
      await this.bookmarkInCategoryRepository.save(newBookmarkInCategory);
    });

    return { ...updatedBmRes, categories: updateBookmarkDto.categories };
  }

  async deleteForGroup(deleteBookmarkDto: DeleteBookmarkDto, user: any) {
    const userId = user.userId || user.id;
    const isUserEditorOrOwner = await this.groupService.isUserEditorOrOwner(
      userId,
      deleteBookmarkDto.groupid
    );
    if (!isUserEditorOrOwner) {
      return { code: 441, message: 'Not a member of the group' };
    }

    const usedInMultipleGroups = await this.bookmarkInGroupRepository.count({
      where: {
        bookmarkid: deleteBookmarkDto.bookmarkid,
      },
    });
    const bmInGrpToRemove = await this.bookmarkInGroupRepository.findOne({
      where: {
        bookmarkid: deleteBookmarkDto.bookmarkid,
        groupid: deleteBookmarkDto.groupid,
      },
    });
    await this.bookmarkInGroupRepository.remove(bmInGrpToRemove);
    if (usedInMultipleGroups <= 1) {
      const bmToRemove = await this.bookmarkRepository.findOne({
        where: { id: deleteBookmarkDto.bookmarkid },
      });
      const bmInCatToRemove = await this.bookmarkInCategoryRepository.find({
        where: {
          bookmarkid: deleteBookmarkDto.bookmarkid,
        },
      });
      await this.bookmarkRepository.remove(bmToRemove);
      return await this.bookmarkInCategoryRepository.remove(bmInCatToRemove);
    }
    const catInGroup = await this.categoryInGroupRepository.find({
      where: {
        groupid: deleteBookmarkDto.groupid,
      },
    });
    const catInGroupIds = catInGroup.map((cat) => {
      return cat.id;
    });
    const bmInCatToRemove = await this.bookmarkInCategoryRepository.find({
      where: {
        bookmarkid: deleteBookmarkDto.bookmarkid,
        categoryid: In(catInGroupIds),
      },
    });
    return await this.bookmarkInCategoryRepository.remove(bmInCatToRemove);
  }
}
