import { Module } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { BookmarksController } from './bookmarks.controller';
import { Bookmark } from './entities/bookmark.entity';
import { BookmarkInCategory } from './entities/bookmark-in-category.entity';
import { BookmarkInGroup } from './entities/bookmark-in-group.entity';
import { GroupModule } from 'src/group/group.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bookmark, BookmarkInCategory, BookmarkInGroup]),
    GroupModule,
    CategoriesModule,
  ],
  controllers: [BookmarksController],
  providers: [BookmarksService],
  exports: [BookmarksService],
})
export class BookmarksModule {}
