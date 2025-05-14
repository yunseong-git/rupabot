import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Record, RecordDocument } from './schemas/record.schema';
import { RecordQueryDto } from './dto/query-record.dto';
import { plainToInstance } from 'class-transformer';
import { applyPagination, QueryOptions } from 'src/common/utils/pagination.utill';
import { AdminRecordQueryResponseDto, RecordQueryResponseDto } from './dto/query-record-response.dto';
import { UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class RecordService {
    constructor(@InjectModel(Record.name) private recordModel: Model<RecordDocument>) { }

    async findMyRecords(id: string, dto: RecordQueryDto): Promise<RecordQueryResponseDto[]> {
        const { sort, limit = 10, skip = 0 } = dto
        const option: QueryOptions = { sort, limit, skip };

        let query = this.recordModel.find({ userId: id });
        query = applyPagination(query, option)

        const records = await query.lean().exec();
        return plainToInstance(RecordQueryResponseDto, records, { excludeExtraneousValues: true });
    }

    async adminFindRecords(user: UserDocument, dto: RecordQueryDto): Promise<AdminRecordQueryResponseDto[]> {
        const records = await this.findMyRecords(user.id, dto)
        
        return plainToInstance(AdminRecordQueryResponseDto, records.map(r => ({
            ...r,
            nickname: user.nickname,
        })), { excludeExtraneousValues: true });
    }
}
