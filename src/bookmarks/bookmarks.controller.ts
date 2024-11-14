import { Controller, Post, Body, Request } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { GetAllForGroupDto } from './dto/get-all-for-group.dto';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post('createBookmark')
  create(@Body() createBookmarkDto: CreateBookmarkDto, @Request() req) {
    return this.bookmarksService.create(createBookmarkDto, req.user);
  }

  @Post('getAllBookmarksForGroup')
  getAllForGroup(@Body() getAllForGroupDto: GetAllForGroupDto, @Request() req) {
    return this.bookmarksService.getAllForGroup(getAllForGroupDto, req.user);
  }
}
