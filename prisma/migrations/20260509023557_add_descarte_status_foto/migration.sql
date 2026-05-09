-- CreateEnum
CREATE TYPE "StatusDescarte" AS ENUM ('PENDENTE', 'APROVADO', 'NEGADO');

-- AlterTable
ALTER TABLE "registros_descarte" ADD COLUMN     "foto_url" TEXT,
ADD COLUMN     "pontos_atribuidos" INTEGER,
ADD COLUMN     "status" "StatusDescarte" NOT NULL DEFAULT 'PENDENTE';
