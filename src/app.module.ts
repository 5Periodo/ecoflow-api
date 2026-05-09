import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CondominiosModule } from './modules/condominios/condominios.module';
import { ApartamentosModule } from './modules/apartamentos/apartamentos.module';
import { MoradoresModule } from './modules/moradores/moradores.module';
import { EcopointsModule } from './modules/ecopoints/ecopoints.module';
import { CategoriasMaterialModule } from './modules/categorias-material/categorias-material.module';
import { DescartesModule } from './modules/descartes/descartes.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { RecompensasModule } from './modules/recompensas/recompensas.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CondominiosModule,
    ApartamentosModule,
    MoradoresModule,
    EcopointsModule,
    CategoriasMaterialModule,
    DescartesModule,
    DashboardModule,
    RecompensasModule,
  ],
})
export class AppModule {}
