import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { Public } from 'src/common/decorators/public.decorator';

@Public()
@Controller('pages/board')
export class BoardPagesController {

    /**게시물 리스트 페이지
     * 구성: 왼쪽-> 1페이지, 오른쪽-> 2페이지 / 오른쪽 페이지의 하단에만 페이지 숫자들이 나온다(2,3,4,...~) 해당 숫자를 클릭하면 숫자에 해당하는 페이지가 나온다
     * 하지만 규칙에 따라서 무조건 왼쪽에 홀수 페이지, 오른쪽에 짝수페이지가 나온다.(ex: 6페이지 선택시 5,6페이지가 나옴)
     * 최초: getAllposts형식, 왼쪽페이지 좌측 상단에 검색창 입력칸 및 검색버튼있음. 오른쪽페이지 우측상단에는 정렬선택버튼이 있음(최근순, 좋아요순) 
     * 검색버튼 클릭시: getSearchedPost, 구성은 동일하다.
     * 게시물 제목 클릭시: postDetail 페이지로 이동
     */
    @Get('posts')
    getPostList(@Res() res: Response) {
        res.sendFile(join(__dirname, '..', '..', 'front', 'src', 'html', 'board', 'postList.html'));
    }

    @Get('detail')
    getPostDetail(@Res() res: Response) {
        res.sendFile(join(__dirname, '..', '..', 'front', 'src', 'html', 'board', 'postDetail.html'));
    }

    @Get('create/post')
    createPost(@Res() res: Response) {
        res.sendFile(join(__dirname, '..', '..', 'front', 'src', 'html', 'board', 'postCreate.html'));
    }

    /**포스트 생성용  */
    @Get('update/post')
    updatePost(@Res() res: Response) {
        res.sendFile(join(__dirname, '..', '..', 'front', 'src', 'html', 'board', 'postUpdate.html'));
    }
}
