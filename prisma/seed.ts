import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log('🌱 Iniciando seed do EcoFlow...');

  // 1. Níveis de fidelidade (conforme documentação de gamificação)
  const niveis = [
    { id: 1, nome: 'Iniciante',   pontosMinimos: 0,    icone: 'iniciante'   },
    { id: 2, nome: 'Colaborador', pontosMinimos: 500,  icone: 'colaborador' },
    { id: 3, nome: 'Expert',      pontosMinimos: 2000, icone: 'expert'      },
    { id: 4, nome: 'Guardião',    pontosMinimos: 5000, icone: 'guardiao'    },
  ];
  for (const nivel of niveis) {
    await prisma.nivel.upsert({ where: { id: nivel.id }, update: nivel, create: nivel });
  }
  console.log('✅ Níveis de fidelidade criados');

  // 2. Categorias de material (pontos/kg conforme documentação de gamificação)
  const categorias = [
    { id: 1, nome: 'Metal / Alumínio', icone: 'metal',    pontosPorKg: 50 },
    { id: 2, nome: 'Vidro',            icone: 'vidro',    pontosPorKg: 40 },
    { id: 3, nome: 'Plástico',         icone: 'plastico', pontosPorKg: 30 },
    { id: 4, nome: 'Papel / Papelão',  icone: 'papel',    pontosPorKg: 20 },
    { id: 5, nome: 'Orgânico',         icone: 'organico', pontosPorKg: 10 },
  ];
  for (const cat of categorias) {
    await prisma.categoriaMaterial.upsert({ where: { id: cat.id }, update: cat, create: cat });
  }
  console.log('✅ Categorias de material criadas');

  // 3. Condomínio de exemplo
  const condominio = await prisma.condominio.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      nome: 'Condomínio EcoFlow Demo',
      metaMensalKg: 1200,
    },
  });
  console.log(`✅ Condomínio criado: ${condominio.nome}`);

  // 4. Meta mensal para o mês atual
  const hoje = new Date();
  await prisma.metaMensal.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      condominioId: condominio.id,
      mes: hoje.getMonth() + 1,
      ano: hoje.getFullYear(),
      metaKg: 1200,
      realizadoKg: 0,
    },
  });
  console.log('✅ Meta mensal criada');

  // 5. Usuário Síndico
  const senhaHash = await bcrypt.hash('ecoflow123', 10);
  await prisma.usuario.upsert({
    where: { email: 'sindico@ecoflow.com' },
    update: {},
    create: {
      condominioId: condominio.id,
      nome: 'Carlos Roberto (Síndico)',
      email: 'sindico@ecoflow.com',
      senhaHash,
      role: 'SINDICO',
    },
  });
  console.log('✅ Usuário síndico criado: sindico@ecoflow.com / ecoflow123');

  // 6. Apartamentos de exemplo
  const aptos = [
    { id: '00000000-0000-0000-0000-000000000010', numero: '101', bloco: 'A' },
    { id: '00000000-0000-0000-0000-000000000011', numero: '201', bloco: 'A' },
    { id: '00000000-0000-0000-0000-000000000012', numero: '305', bloco: 'B' },
  ];
  for (const ap of aptos) {
    await prisma.apartamento.upsert({
      where: { id: ap.id },
      update: {},
      create: { ...ap, condominioId: condominio.id },
    });
  }
  console.log('✅ Apartamentos criados');

  // 7. Moradores de exemplo
  const moradores = [
    { email: 'joao@ecoflow.com',   nome: 'João Silva',    apartamentoId: '00000000-0000-0000-0000-000000000010' },
    { email: 'ana@ecoflow.com',    nome: 'Ana Paula',     apartamentoId: '00000000-0000-0000-0000-000000000011' },
    { email: 'carlos@ecoflow.com', nome: 'Carlos Oliveira', apartamentoId: '00000000-0000-0000-0000-000000000012' },
  ];
  for (const m of moradores) {
    await prisma.morador.upsert({
      where: { email: m.email },
      update: {},
      create: {
        nome: m.nome,
        email: m.email,
        senhaHash,
        apartamentoId: m.apartamentoId,
        pontosTotal: 0,
        nivelAtual: 1,
      },
    });
  }
  console.log('✅ Moradores criados');

  // 8. Ecopoint de exemplo com QR Code
  await prisma.ecopoint.upsert({
    where: { qrCodeHash: 'ECOFLOW-DEMO-QR-HALL-A' },
    update: {},
    create: {
      condominioId: condominio.id,
      descricao: 'Ponto de Coleta - Hall Bloco A',
      localizacao: 'Térreo, ao lado da portaria do Bloco A',
      qrCodeHash: 'ECOFLOW-DEMO-QR-HALL-A',
      status: 'ATIVO',
    },
  });
  console.log('✅ Ecopoint criado (QR Code: ECOFLOW-DEMO-QR-HALL-A)');

  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('📌 Credenciais de acesso:');
  console.log('   Síndico: sindico@ecoflow.com / ecoflow123');
  console.log('   Morador: joao@ecoflow.com / ecoflow123');
  console.log('   Morador: ana@ecoflow.com / ecoflow123');
  console.log('   Morador: carlos@ecoflow.com / ecoflow123');
}

main()
  .catch((e) => { console.error('❌ Erro no seed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
