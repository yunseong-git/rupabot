import { ApiProperty } from '@nestjs/swagger';

export namespace PostCommandResponseDto {
  export class Like {
    @ApiProperty({ example: 'liked' })
    status: 'liked' | 'unliked';
  }
  export class Simple {
    @ApiProperty({ example: '660fa04149ac491601f005b6' })
    postId: string;
  }
  export class Update {
    @ApiProperty({ example: 'true' })
    isUpdated: boolean;
  }
  export class Delete {
    @ApiProperty({ example: 'true' })
    isDeleted: boolean;
  }
}