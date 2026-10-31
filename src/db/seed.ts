import { eq } from 'drizzle-orm';
import { createDb } from './client';
import { resources, roomResources, rooms, users } from './schema';

const db = createDb();

// Criando a base de dados dos usuários do sistema
db.insert(users)
  .values([
    { name: 'Ana Souza', email: 'ana@empresa.com', role: 'user' },
    { name: 'Bruno Lima', email: 'bruno@empresa.com', role: 'user' },
    { name: 'Carla Admin', email: 'admin@empresa.com', role: 'admin' },
  ])
  .onConflictDoNothing()
  .run();
// Criando a base de itens que terá em casa sala
const resourceNames = ['Projetor', 'Videoconferência', 'Quadro branco', 'TV'];
db.insert(resources)
  .values(resourceNames.map((name) => ({ name })))
  .onConflictDoNothing()
  .run();
// Base de dados referente a cada sala existente
const roomSeed = [
  { name: 'Sala Alfa', capacity: 4, location: 'Térreo', items: ['TV'] },
  {
    name: 'Sala Beta',
    capacity: 6,
    location: '1º andar',
    items: ['Quadro branco'],
  },
  {
    name: 'Sala charlie',
    capacity: 8,
    location: '1º andar',
    items: ['Projetor', 'Quadro branco'],
  },
  {
    name: 'Sala delta',
    capacity: 12,
    location: '2º andar',
    items: ['Projetor', 'Videoconferência'],
  },
  {
    name: 'Sala echo',
    capacity: 20,
    location: '2º andar',
    items: ['Projetor', 'Videoconferência', 'Quadro branco'],
  },
  {
    name: 'Auditório juliet',
    capacity: 40,
    location: 'Térreo',
    items: ['Projetor', 'Videoconferência', 'TV'],
  },
];

// Criação de relacionamento das salas com demais dados
for (const item of roomSeed) {
  // Criando a base de dados das salas de reunião
  db.insert(rooms)
    .values({
      name: item.name,
      capacity: item.capacity,
      location: item.location,
    })
    .onConflictDoNothing()
    .run();
  // Acha o ID da sala pelo nome
  const room = db.select().from(rooms).where(eq(rooms.name, item.name)).get();
  if (!room) continue;
  // 2. Passa por cada item da lista de equipamentos daquela sala
  for (const resourceName of item.items) {
    // 3. Acha o ID do equipamento pelo nome
    const resource = db
      .select()
      .from(resources)
      .where(eq(resources.name, resourceName))
      .get();
    if (!resource) continue;
    // 4. Insere a duplinha na tabela relacionamento
    db.insert(roomResources)
      .values({ roomId: room.id, resourceId: resource.id })
      .onConflictDoNothing()
      .run();
  }
}

console.log('Seed concluído.');
