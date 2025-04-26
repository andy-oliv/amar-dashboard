import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RollcallService } from './rollcall.service';

@ApiTags('Roll Calls')
@Controller('rollcalls')
export class RollcallController {
  constructor(private readonly rollcallService: RollcallService) {}
}
