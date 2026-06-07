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
    { id: 1, nome: 'Iniciante', pontosMinimos: 0, icone: 'iniciante' },
    { id: 2, nome: 'Colaborador', pontosMinimos: 500, icone: 'colaborador' },
    { id: 3, nome: 'Expert', pontosMinimos: 2000, icone: 'expert' },
    { id: 4, nome: 'Guardião', pontosMinimos: 5000, icone: 'guardiao' },
  ];
  for (const nivel of niveis) {
    await prisma.nivel.upsert({
      where: { id: nivel.id },
      update: nivel,
      create: nivel,
    });
  }
  console.log('✅ Níveis de fidelidade criados');

  // 2. Categorias de material (pontos/kg conforme documentação de gamificação)
  const categorias = [
    { id: 1, nome: 'Metal / Alumínio', icone: 'metal', pontosPorKg: 50 },
    { id: 2, nome: 'Vidro', icone: 'vidro', pontosPorKg: 40 },
    { id: 3, nome: 'Plástico', icone: 'plastico', pontosPorKg: 30 },
    { id: 4, nome: 'Papel / Papelão', icone: 'papel', pontosPorKg: 20 },
    { id: 5, nome: 'Orgânico', icone: 'organico', pontosPorKg: 10 },
  ];
  for (const cat of categorias) {
    await prisma.categoriaMaterial.upsert({
      where: { id: cat.id },
      update: cat,
      create: cat,
    });
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
    {
      email: 'joao@ecoflow.com',
      nome: 'João Silva',
      apartamentoId: '00000000-0000-0000-0000-000000000010',
    },
    {
      email: 'ana@ecoflow.com',
      nome: 'Ana Paula',
      apartamentoId: '00000000-0000-0000-0000-000000000011',
    },
    {
      email: 'carlos@ecoflow.com',
      nome: 'Carlos Oliveira',
      apartamentoId: '00000000-0000-0000-0000-000000000012',
    },
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

  // 9. Descartes de exemplo (Histórico e Ranking)
  const moradorJoao = await prisma.morador.findUnique({
    where: { email: 'joao@ecoflow.com' },
  });
  const moradorAna = await prisma.morador.findUnique({
    where: { email: 'ana@ecoflow.com' },
  });
  const moradorCarlos = await prisma.morador.findUnique({
    where: { email: 'carlos@ecoflow.com' },
  });
  const ecoponto = await prisma.ecopoint.findUnique({
    where: { qrCodeHash: 'ECOFLOW-DEMO-QR-HALL-A' },
  });

  if (moradorJoao && moradorAna && moradorCarlos && ecoponto) {
    // Limpa os descartes antigos para evitar duplicidade em múltiplos seeds
    await prisma.registroDescarte.deleteMany({});

    const descartesSeed = [
      // Descartes Aprovados (Geram histórico, ranking e pontos)
      {
        moradorId: moradorJoao.id,
        apartamentoId: moradorJoao.apartamentoId,
        ecopointId: ecoponto.id,
        categoriaMaterialId: 3,
        pesoKg: 2.5,
        pontosGerados: 75,
        pontosAtribuidos: 75,
        status: 'APROVADO' as any,
        fotoUrls: [
          'https://via.placeholder.com/300x200/2A4A4A/D4F4DD?text=Plastico',
          'https://via.placeholder.com/300x200/2A4A4A/D4F4DD?text=Foto2',
        ],
        dataColeta: new Date(hoje.getFullYear(), hoje.getMonth(), 5),
      },
      {
        moradorId: moradorAna.id,
        apartamentoId: moradorAna.apartamentoId,
        ecopointId: ecoponto.id,
        categoriaMaterialId: 4,
        pesoKg: 5.0,
        pontosGerados: 100,
        pontosAtribuidos: 100,
        status: 'APROVADO' as any,
        fotoUrls: [
          'https://via.placeholder.com/300x200/2A4A4A/D4F4DD?text=Papelao',
        ],
        dataColeta: new Date(hoje.getFullYear(), hoje.getMonth(), 8),
      },
      {
        moradorId: moradorCarlos.id,
        apartamentoId: moradorCarlos.apartamentoId,
        ecopointId: ecoponto.id,
        categoriaMaterialId: 1,
        pesoKg: 1.2,
        pontosGerados: 60,
        pontosAtribuidos: 60,
        status: 'APROVADO' as any,
        fotoUrls: [
          'https://via.placeholder.com/300x200/2A4A4A/D4F4DD?text=Metal',
        ],
        dataColeta: new Date(hoje.getFullYear(), hoje.getMonth(), 10),
      },
      {
        moradorId: moradorJoao.id,
        apartamentoId: moradorJoao.apartamentoId,
        ecopointId: ecoponto.id,
        categoriaMaterialId: 2,
        pesoKg: 3.0,
        pontosGerados: 120,
        pontosAtribuidos: 120,
        status: 'APROVADO' as any,
        fotoUrls: [
          'https://via.placeholder.com/300x200/2A4A4A/D4F4DD?text=Vidro',
        ],
        dataColeta: new Date(hoje.getFullYear(), hoje.getMonth(), 12),
      },

      // Descartes Pendentes (Para o síndico aprovar)
      {
        moradorId: moradorAna.id,
        apartamentoId: moradorAna.apartamentoId,
        ecopointId: ecoponto.id,
        categoriaMaterialId: 3,
        pesoKg: 1.5,
        pontosGerados: 45,
        pontosAtribuidos: null,
        status: 'PENDENTE' as any,
        fotoUrls: [
          'https://via.placeholder.com/300x200/FF9500/FFFFFF?text=Plastico+1',
          'https://via.placeholder.com/300x200/FF9500/FFFFFF?text=Plastico+2',
          'https://via.placeholder.com/300x200/FF9500/FFFFFF?text=Plastico+3',
        ],
        dataColeta: new Date(hoje.getTime() - 1000 * 60 * 60 * 24),
      },
      {
        moradorId: moradorCarlos.id,
        apartamentoId: moradorCarlos.apartamentoId,
        ecopointId: ecoponto.id,
        categoriaMaterialId: 5,
        pesoKg: 4.0,
        pontosGerados: 40,
        pontosAtribuidos: null,
        status: 'PENDENTE' as any,
        fotoUrls: [
          'https://via.placeholder.com/300x200/FF9500/FFFFFF?text=Organico',
        ],
        dataColeta: new Date(),
      },

      // Descarte Negado
      {
        moradorId: moradorJoao.id,
        apartamentoId: moradorJoao.apartamentoId,
        ecopointId: ecoponto.id,
        categoriaMaterialId: 3,
        pesoKg: 0.5,
        pontosGerados: 15,
        pontosAtribuidos: 0,
        status: 'NEGADO' as any,
        fotoUrls: [
          'https://via.placeholder.com/300x200/ef4444/FFFFFF?text=Recusado',
        ],
        dataColeta: new Date(hoje.getFullYear(), hoje.getMonth(), 2),
      },
    ];

    for (const d of descartesSeed) {
      await prisma.registroDescarte.create({ data: d });
    }
    console.log(
      '✅ Descartes simulados criados (Pendentes, Aprovados e Negados)',
    );

    // Atualizar os pontos e nível dos moradores baseado nos descartes aprovados
    const moradoresArray = [moradorJoao, moradorAna, moradorCarlos];
    for (const m of moradoresArray) {
      const aprovados = descartesSeed.filter(
        (d) => d.moradorId === m.id && d.status === 'APROVADO',
      );
      const pontosTotal = aprovados.reduce(
        (acc, curr) => acc + (curr.pontosAtribuidos || 0),
        0,
      );
      if (pontosTotal > 0) {
        const novoNivel = await prisma.nivel.findFirst({
          where: { pontosMinimos: { lte: pontosTotal } },
          orderBy: { pontosMinimos: 'desc' },
        });
        await prisma.morador.update({
          where: { id: m.id },
          data: { pontosTotal, nivelAtual: novoNivel?.id || 1 },
        });
      }
    }

    // Atualizar meta do condomínio
    const totalReciclado = descartesSeed
      .filter((d) => d.status === 'APROVADO')
      .reduce((acc, curr) => acc + curr.pesoKg, 0);
    const meta = await prisma.metaMensal.findFirst({
      where: {
        condominioId: condominio.id,
        mes: hoje.getMonth() + 1,
        ano: hoje.getFullYear(),
      },
    });
    if (meta) {
      await prisma.metaMensal.update({
        where: { id: meta.id },
        data: { realizadoKg: totalReciclado },
      });
    }
    // --- Recompensas e Resgates ---
    const recompensa1 = await prisma.recompensa.create({
      data: {
        condominioId: condominio.id,
        titulo: 'Desconto de 5% na Taxa de Condomínio',
        descricao: 'Abata 5% no valor da sua próxima cota condominial mensal.',
        custoPontos: 500,
        tipo: 'DESCONTO_CONDOMINIO',
        valorDesconto: 5,
        quantidadeDisponivel: -1,
        status: 'ATIVA',
      },
    });

    const recompensa2 = await prisma.recompensa.create({
      data: {
        condominioId: condominio.id,
        titulo: 'Cupom R$20 no iFood',
        descricao: 'Resgate um cupom exclusivo para pedir seu lanche favorito.',
        custoPontos: 300,
        tipo: 'CUPOM_PARCEIRO',
        valorDesconto: 20,
        quantidadeDisponivel: 10,
        status: 'ATIVA',
      },
    });

    await prisma.resgate.create({
      data: {
        moradorId: moradorJoao.id,
        recompensaId: recompensa1.id,
        codigoCupom: 'ECO-JOAO5DESC',
        status: 'PENDENTE',
      },
    });

    await prisma.resgate.create({
      data: {
        moradorId: moradorAna.id,
        recompensaId: recompensa2.id,
        codigoCupom: 'ECO-IFOOD20ANA',
        status: 'UTILIZADO',
        utilizadoEm: new Date(hoje.getTime() - 1000 * 60 * 60 * 48),
      },
    });

    console.log('✅ Recompensas simuladas criadas');
  }

  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('📌 Credenciais de acesso:');
  console.log('   Síndico: sindico@ecoflow.com / ecoflow123');
  console.log('   Morador: joao@ecoflow.com / ecoflow123');
  console.log('   Morador: ana@ecoflow.com / ecoflow123');
  console.log('   Morador: carlos@ecoflow.com / ecoflow123');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
