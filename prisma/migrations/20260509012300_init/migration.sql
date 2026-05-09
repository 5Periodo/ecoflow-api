-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SINDICO', 'ADMIN');

-- CreateEnum
CREATE TYPE "StatusApartamento" AS ENUM ('ATIVO', 'INATIVO');

-- CreateEnum
CREATE TYPE "StatusEcopoint" AS ENUM ('ATIVO', 'INATIVO', 'MANUTENCAO');

-- CreateEnum
CREATE TYPE "TipoRecompensa" AS ENUM ('DESCONTO_CONDOMINIO', 'CUPOM_PARCEIRO');

-- CreateEnum
CREATE TYPE "StatusRecompensa" AS ENUM ('ATIVA', 'PAUSADA', 'ENCERRADA');

-- CreateEnum
CREATE TYPE "StatusResgate" AS ENUM ('PENDENTE', 'UTILIZADO', 'EXPIRADO');

-- CreateEnum
CREATE TYPE "StatusMeta" AS ENUM ('EM_ANDAMENTO', 'ATINGIDA', 'NAO_ATINGIDA');

-- CreateTable
CREATE TABLE "condominios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "meta_mensal_kg" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "condominios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "condominio_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apartamentos" (
    "id" TEXT NOT NULL,
    "condominio_id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "bloco" TEXT,
    "status" "StatusApartamento" NOT NULL DEFAULT 'ATIVO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "apartamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moradores" (
    "id" TEXT NOT NULL,
    "apartamento_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "pontos_total" INTEGER NOT NULL DEFAULT 0,
    "nivel_atual" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "moradores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "niveis" (
    "id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "pontos_minimos" INTEGER NOT NULL,
    "icone" TEXT NOT NULL,

    CONSTRAINT "niveis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ecopoints" (
    "id" TEXT NOT NULL,
    "condominio_id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "localizacao" TEXT NOT NULL,
    "qr_code_hash" TEXT NOT NULL,
    "status" "StatusEcopoint" NOT NULL DEFAULT 'ATIVO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ecopoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias_material" (
    "id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "icone" TEXT NOT NULL,
    "pontos_por_kg" INTEGER NOT NULL,

    CONSTRAINT "categorias_material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registros_descarte" (
    "id" TEXT NOT NULL,
    "morador_id" TEXT NOT NULL,
    "apartamento_id" TEXT NOT NULL,
    "ecopoint_id" TEXT NOT NULL,
    "categoria_material_id" INTEGER NOT NULL,
    "peso_kg" DECIMAL(65,30) NOT NULL,
    "pontos_gerados" INTEGER NOT NULL,
    "data_coleta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacoes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registros_descarte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recompensas" (
    "id" TEXT NOT NULL,
    "condominio_id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "custo_pontos" INTEGER NOT NULL,
    "tipo" "TipoRecompensa" NOT NULL,
    "valor_desconto" DECIMAL(65,30),
    "quantidade_disponivel" INTEGER NOT NULL DEFAULT -1,
    "validade" TIMESTAMP(3),
    "status" "StatusRecompensa" NOT NULL DEFAULT 'ATIVA',

    CONSTRAINT "recompensas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resgates" (
    "id" TEXT NOT NULL,
    "morador_id" TEXT NOT NULL,
    "recompensa_id" TEXT NOT NULL,
    "codigo_cupom" TEXT NOT NULL,
    "status" "StatusResgate" NOT NULL DEFAULT 'PENDENTE',
    "resgatado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "utilizado_em" TIMESTAMP(3),

    CONSTRAINT "resgates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rankings_mensais" (
    "id" TEXT NOT NULL,
    "condominio_id" TEXT NOT NULL,
    "apartamento_id" TEXT NOT NULL,
    "mes" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "total_kg" DECIMAL(65,30) NOT NULL,
    "total_pontos" INTEGER NOT NULL,
    "posicao" INTEGER NOT NULL,
    "calculado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rankings_mensais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metas_mensais" (
    "id" TEXT NOT NULL,
    "condominio_id" TEXT NOT NULL,
    "mes" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "meta_kg" DECIMAL(65,30) NOT NULL,
    "realizado_kg" DECIMAL(65,30) NOT NULL,
    "status" "StatusMeta" NOT NULL DEFAULT 'EM_ANDAMENTO',

    CONSTRAINT "metas_mensais_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "moradores_email_key" ON "moradores"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ecopoints_qr_code_hash_key" ON "ecopoints"("qr_code_hash");

-- CreateIndex
CREATE UNIQUE INDEX "resgates_codigo_cupom_key" ON "resgates"("codigo_cupom");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_condominio_id_fkey" FOREIGN KEY ("condominio_id") REFERENCES "condominios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apartamentos" ADD CONSTRAINT "apartamentos_condominio_id_fkey" FOREIGN KEY ("condominio_id") REFERENCES "condominios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moradores" ADD CONSTRAINT "moradores_apartamento_id_fkey" FOREIGN KEY ("apartamento_id") REFERENCES "apartamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moradores" ADD CONSTRAINT "moradores_nivel_atual_fkey" FOREIGN KEY ("nivel_atual") REFERENCES "niveis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ecopoints" ADD CONSTRAINT "ecopoints_condominio_id_fkey" FOREIGN KEY ("condominio_id") REFERENCES "condominios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_descarte" ADD CONSTRAINT "registros_descarte_morador_id_fkey" FOREIGN KEY ("morador_id") REFERENCES "moradores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_descarte" ADD CONSTRAINT "registros_descarte_apartamento_id_fkey" FOREIGN KEY ("apartamento_id") REFERENCES "apartamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_descarte" ADD CONSTRAINT "registros_descarte_ecopoint_id_fkey" FOREIGN KEY ("ecopoint_id") REFERENCES "ecopoints"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_descarte" ADD CONSTRAINT "registros_descarte_categoria_material_id_fkey" FOREIGN KEY ("categoria_material_id") REFERENCES "categorias_material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recompensas" ADD CONSTRAINT "recompensas_condominio_id_fkey" FOREIGN KEY ("condominio_id") REFERENCES "condominios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resgates" ADD CONSTRAINT "resgates_morador_id_fkey" FOREIGN KEY ("morador_id") REFERENCES "moradores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resgates" ADD CONSTRAINT "resgates_recompensa_id_fkey" FOREIGN KEY ("recompensa_id") REFERENCES "recompensas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rankings_mensais" ADD CONSTRAINT "rankings_mensais_condominio_id_fkey" FOREIGN KEY ("condominio_id") REFERENCES "condominios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rankings_mensais" ADD CONSTRAINT "rankings_mensais_apartamento_id_fkey" FOREIGN KEY ("apartamento_id") REFERENCES "apartamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metas_mensais" ADD CONSTRAINT "metas_mensais_condominio_id_fkey" FOREIGN KEY ("condominio_id") REFERENCES "condominios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
