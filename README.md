# SALA-2: Reserva de Salas e Proteção contra Sobreposição

Esta branch entrega a funcionalidade principal de agendamento de salas, garantindo a integridade dos horários e validando os limites permitidos.

## O que foi implementado

- **Formulário de agendamento**: Escolha de data, hora de início e hora de término para a sala selecionada.
- **Validação de horário comercial e limites**: Restrição para reservas com duração entre 15 minutos e 4 horas, impedindo agendamentos no passado.
- **Prevenção de conflitos**: Validação no servidor que impede a reserva de uma sala já ocupada no mesmo intervalo de tempo (inclusive requisições simultâneas).
- **Testes dedicados**: Validação de cenários de sobreposição de horários e limites de duração.
