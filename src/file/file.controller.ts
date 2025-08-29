import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileService, FileType } from './file.service';

@Controller('files')
export class FileController {
  constructor(private fileService: FileService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  create(
    @Body()
    dto: {
      type:
        | 'AUDIO'
        | 'IMAGE'
        | 'ALBUMIMAGE'
        | 'AVATAR'
        | 'USER'
        | 'CHAT'
        | 'CHATDEF';
    },
    @UploadedFiles() files,
  ) {
    const { image } = files;
    return this.fileService.createFile(FileType[dto.type], image[0]);
  }
}
