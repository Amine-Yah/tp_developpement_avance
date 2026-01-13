import { CreatePlayerDto } from './create-player.dto';
declare const UpdatePlayerDto_base: import("@nestjs/common").Type<Partial<CreatePlayerDto>>;
export declare class UpdatePlayerDto extends UpdatePlayerDto_base {
    rank?: number;
}
export {};
