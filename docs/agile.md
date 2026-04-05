1.	Investigación: metodologías de desarrollo
•	Investiga qué es Agile y cuál es su objetivo en el desarrollo de software
•	Investiga qué es Scrum y sus conceptos principales (roles, sprints, backlog, reviews)
•	Investiga qué es Kanban y cómo se usa para organizar tareas
•	Explica las diferencias entre Scrum y Kanban
•	Describe en qué situaciones se podría usar cada metodología
•	Escribe toda esta información con tus propias palabras

Até 2001, o método utilizado por desenvolvedores era o Waterfall (metodologia em cascata), onde cada fase do projeto precisa ser 100% concluída antes da próxima começar. Como se para iniciar um tratamento, tivesse que esperar que cada exame terminasse para iniciar o seguinte, enviar para aprovação cada um entre eles, esperar a resposta... com tanta demora, um tratamento poderia demorar um ano para começar, até aí seu paciente já não está entre nós ou os medicamentos escolhidos no início das suspeitas já entrou em desuso. O mesmo acontecia com os projetos, eles morriam ou ficavam defasados antes de lançar.
O manifesto ágil (Manifest for Agile Software Development) foi um documento curto, mas que mudou tudo em 2001. Estabeleceu quatro valores, propondo que os valores da esquerda importam mais, mas que não descarta os valores da direita.
Valor 1	Indivíduos e interações > Processos e ferramentas
Valor 2 	Software funcionando > Documentação exaustiva
Valor 3	Colaboração com o Cliente > Negociação de contratos
Valor 4	Responder a mudanças > Seguir um plano

Além desses valores, que são a filosofia do Agile, há 12 princípios que são bastante orientativos para profissionais: 
#	Princípio	O que significa na prática
1	Satisfaça o cliente com entregas frequentes	Entregue cedo, entregue sempre, pegue feedback
2	Bem-vindo a mudanças, mesmo no final	Não entre em pânico quando o cliente mudar de ideia
3	Entregue software funcionando frequentemente	Semanas, não meses — sprints pequenas
4	Colaboração diária entre negócio e dev	Dev e cliente no mesmo time, não em lados opostos
5	Construa projetos com pessoas motivadas	Equipe confiante > equipe vigiada
6	Comunicação face a face é a mais eficiente	Uma reunião de 10 min vale 40 emails
7	Software funcionando = medida de progresso	Não "% concluído" — e sim "funciona ou não funciona"
8	Ritmo sustentável e constante	Ninguém aguenta sprint de 80h por semana
9	Excelência técnica e bom design	Código bem feito = mais fácil de adaptar depois
10	Simplicidade — maximize o trabalho não feito	Não construa o que não foi pedido
11	Times auto-organizados entregam mais	Equipe que decide como trabalhar > equipe microgerenciada
12	Reflexão contínua e adaptação	Retrospectivas — a equipe sempre melhora

Ainda que chamemos de metodologia, o Agile na verdade é mais uma filosofia, uma mentalidade ou valores a serem seguidos. Dentro dele, há implementações específicas, como Scrum, Kanban, XP, Safe, LeSS e outros.
Em Agile se entrega valores continuamente, em ciclos curtos, colaborando com o cliente e adaptando-se às mudanças. Um dos seus pontos muito importantes para destacar no mercado atual é o de que uma equipe bem motivada e de confiança é muito mais produtiva e requer menos recursos que uma equipe que precise ser vigiada.

Tratando da implementações específicas citadas, temos o Scrum e Kanban.
No Scrum, há papéis definidos, ciclos de início e fim, e reuniões obrigatórias. Esses papéis são já definidos da seguinte maneira:
Papel	O que faz
Product Owner (PO)	Define o que será construído e em que ordem
Scrum Master (SM)	Remove obstáculos, facilita o processo
Dev Team	Constrói o produto

Além disso, o Scrum tem ciclos determinados dentro dele para orientar todo o projeto:
Sprint (iteração)	Um ciclo de trabalho de 1 a 4 semanas com objetivo definido
Product backlog (lista de requisitos)	É a lista completa de tudo que o produto precisa ter, ordenada por prioridade
Sprint Backlog	O subconjunto do Product Backlog escolhido para aquela sprint específica
Sprint Review	Ao fim de cada sprint, a equipe apresenta o que construiu ao PO
Sprint Retrospectiva	A equipe discute: "O que funcionou? O que melhorar?" 
Daily Scrum	Reunião rápida de 15 minutos. Cada um responde: o que fiz ontem, o que farei hoje, tem algum obstáculo?

Tratando de Kanban, que significa um cartão visual em sua origem dos anos 50, cada tarefa (cartão) se move por colunas de um quadro de progresso. Exemplo:
 [Animais esperando] → [Em consulta] → [Em exame] → [Alta]
Dentro dele, o conceito de WIP Limit (Work in Progress Limit) se apresenta como o limite máximo de tarefas simultâneas em uma coluna. Ou seja, se você tem um mesa cirurgia, só pode ter um animal em cirurgia por vez. Assim, se evita a sobrecarga.
No Kanban, não há sprints fixas nem papéis obrigatórios, é um fluxo contínuo.
Característica	Scrum	Kanban
Ciclos	Sprints fixas (1-4 semanas)	Fluxo contínuo, sem ciclos
Papéis	PO, SM, Dev Team (obrigatórios)	Sem papéis definidos unir
Quadro	Criado e apagado a cada sprint	Permanente, evolutivo yagogonzalez
Mudanças	Só entre sprints	A qualquer momento
Reuniões	Daily, Review, Retro (obrigatórias)	Daily opcional kbase.com
Foco	Velocidade por iteração	Fluxo e eliminação de gargalos

Para facilitar a decisão entre qual do dois métodos usar, considere:
Scrum:
•	O projeto tem escopo evolutivo — você não sabe tudo que vai precisar desde o início;
•	A equipe é dedicada exclusivamente ao projeto;
•	Você quer entregas frequentes e feedback do cliente a cada ciclo;
•	Ex: Desenvolver um app novo do zero

Kanban:
•	O trabalho chega de forma imprevisível e contínua;
•	Você precisa priorizar rapidamente;
•	A equipe cuida de múltiplos projetos ao mesmo tempo;
•	Ex: Equipe de suporte/manutenção que recebe bugs e pedidos variados.
