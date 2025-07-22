## Planejamento Estético - Brechó do Futuro

### 1. Identidade Visual

- **Paleta de Cores:** Combinação de tons neutros (cinza, bege) com cores vibrantes de acento (verde-água, laranja queimado, azul-petróleo) que remetem tanto a vintage quanto futurismo.
- **Tipografia:**
    - Títulos: Fonte geométrica moderna com personalidade (como Montserrat, Futura ou Space Grotesk)
    - Corpo: Fonte legível e clean (como Inter, Roboto ou Open Sans)
- **Logo:** Unir elementos retrô com futuristas - como uma máquina de costura vintage com elementos de tecnologia ou um cabide clássico com elementos neon/holográficos.

### 2. Design System com shadcn/ui

- **Customização de componentes:** Modificar o tema padrão do shadcn para refletir sua paleta de cores personalizada.
- **Adaptação dos componentes:** Dar um toque retrô-futurista aos botões, cards e formulários.
- **Consistência visual:** Definir border-radius, sombras e efeitos hover padronizados.

### 3. Layout e Experiência

- **Grid híbrido:** Misturar elementos estruturados (grid tradicional para produtos) com elementos mais orgânicos e fluidos.
- **Animações sutis:** Usar framer-motion ou CSS transitions para micro-interações que elevam a experiência.
- **Modo claro/escuro:** Implementar ambos os temas para dar escolha ao usuário.

### 4. Elementos Visuais Temáticos

- **Texturas:** Incorporar texturas vintage como tecidos, papel antigo ou padrões retrô em algumas seções.
- **Iconografia:** Misturar ícones retrô (máquinas de escrever, discos de vinil) com elementos futuristas (hologramas, interfaces minimalistas).
- **Fotografias:** Estilo de fotografia com tratamento que remeta tanto ao passado quanto ao futuro.

### 5. Próximos Passos

1. **Criar moodboard:** Reunir referências visuais em uma ferramenta como Pinterest ou Figma para consolidar a direção estética.
2. **Prototipar componentes-chave:** Desenvolver versões iniciais dos principais componentes com o tema personalizado.
3. **Implementar tema no tailwind.config.js:** Configurar as cores, tipografia e outros elementos do design system.
4. **Configurar o tema shadcn:** Adaptar os componentes shadcn para refletir a identidade visual definida.
5. **Aplicar gradualmente:** Implementar o design em componentes críticos primeiro (header, product cards, checkout) antes de expandir para todo o site.

Para implementação técnica, você pode criar um arquivo theme.css ou utilizar o próprio tailwind.config.js para definir suas variáveis de design token. Isso garantirá que você mantenha consistência em todo o projeto.
