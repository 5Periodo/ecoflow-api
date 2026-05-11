import { ApiProperty } from '@nestjs/swagger';

class AdminUserResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  condominioId: string;
}

export class LoginAdminResponseDto {
  @ApiProperty({ description: 'Token de acesso JWT' })
  access_token: string;

  @ApiProperty({ type: AdminUserResponse })
  user: AdminUserResponse;
}

class MoradorResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  apartamentoId: string;
}

export class LoginMoradorResponseDto {
  @ApiProperty({ description: 'Token de acesso JWT' })
  access_token: string;

  @ApiProperty({ type: MoradorResponse })
  morador: MoradorResponse;
}
