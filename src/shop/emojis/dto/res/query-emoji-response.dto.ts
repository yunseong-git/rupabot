import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class EmojisResponseDto {
    @Expose()
    name: string;

    @Expose()
    price: number;

    @Expose()
    image: string;
}
