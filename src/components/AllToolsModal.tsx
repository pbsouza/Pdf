import React from 'react';
import {
  X,
  BookOpen,
  Grid,
  FilePlus,
  Scissors,
  Layers,
  CheckSquare,
  Lock,
  Highlighter,
  MessageSquare,
  PenTool,
  Printer,
  ShieldCheck,
  FolderOpen,
  Save,
  RotateCw,
  Search,
  ExternalLink,
} from 'lucide-react';

interface AllToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunAction: (actionKey: string) => void;
}

export const AllToolsModal: React.FC<AllToolsModalProps> = ({
  isOpen,
  onClose,
  onRunAction,
}) => {
  if (!isOpen) return null;

  const categories = [
    {
      title: 'Organização & Páginas',
      tools: [
        { key: 'organize', title: 'Organizar Páginas', desc: 'Bancada visual em grade para reordenar, girar e excluir páginas', icon: Grid },
        { key: 'combine', title: 'Combinar Arquivos', desc: 'Mesclar múltiplos documentos PDF em um único com marcadores', icon: FilePlus },
        { key: 'split', title: 'Dividir Documento', desc: 'Dividir por número de páginas ou extrair capítulos selecionados', icon: Scissors },
        { key: 'rotate_cw', title: 'Girar Páginas', desc: 'Girar páginas no sentido horário ou anti-horário (90°, 180°)', icon: RotateCw },
        { key: 'insert_blank', title: 'Inserir Página em Branco', desc: 'Adicionar páginas A4 ou Carta em branco em qualquer posição', icon: FilePlus },
      ],
    },
    {
      title: 'Revisão & Anotações',
      tools: [
        { key: 'tool_highlight', title: 'Destacar Texto', desc: 'Selecione ou arraste para realçar trechos em amarelo, azul ou rosa', icon: Highlighter },
        { key: 'tool_note', title: 'Comentários com Respostas', desc: 'Inserir notas adesivas com controle de status e conversas', icon: MessageSquare },
        { key: 'tool_draw', title: 'Desenho Livre', desc: 'Desenhar traços vetoriais com caneta diretamente na página', icon: PenTool },
        { key: 'tool_stamp', title: 'Carimbos', desc: 'Aplicar carimbos APROVADO, RASCUNHO, CONFIDENCIAL ou REVISADO', icon: ShieldCheck },
        { key: 'tool_redact', title: 'Censura / Redação', desc: 'Ocultar dados sensíveis com segurança atômica permanente', icon: Lock },
      ],
    },
    {
      title: 'Formulários & Assinaturas',
      tools: [
        { key: 'create_form', title: 'Criar Formulário do Zero', desc: 'Criar documento em branco ou usar modelos prontos (Cadastro, O.S., Acordo)', icon: FilePlus },
        { key: 'builder_mode', title: 'Criar Campos no PDF', desc: 'Inserir e posicionar caixas de texto, checkboxes, menus e assinaturas', icon: CheckSquare },
        { key: 'tool_form_fill', title: 'Preencher Formulário', desc: 'Preenchimento interativo de campos de texto, caixas e seleções', icon: CheckSquare },
        { key: 'tool_sign', title: 'Assinatura Digital', desc: 'Assine digitalmente com carimbo de verificação criptográfica', icon: PenTool },
        { key: 'clear_form', title: 'Limpar Formulário', desc: 'Redefinir todos os campos para seus estados originais em branco', icon: Scissors },
      ],
    },
    {
      title: 'Visualização & Navegação',
      tools: [
        { key: 'view_twoup', title: 'Modo Leitura Dupla', desc: 'Exibição de páginas lado a lado ideal para livros e artigos', icon: BookOpen },
        { key: 'find_text', title: 'Localizar Texto', desc: 'Busca dinâmica no documento com contador de ocorrências', icon: Search },
        { key: 'layers_panel', title: 'Camadas do Documento', desc: 'Alternar marcas d’água, artes de fundo e notas de impressão', icon: Layers },
        { key: 'doc_properties', title: 'Propriedades do Documento', desc: 'Inspecionar fontes, criptografia, metadados e permissões', icon: ShieldCheck },
        { key: 'print_doc', title: 'Imprimir Documento', desc: 'Enviar páginas vetoriais em alta fidelidade para a impressora', icon: Printer },
      ],
    },
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-neutral-850 rounded-2xl shadow-2xl border border-neutral-300 dark:border-neutral-700 w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden text-xs"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#b70228]" />
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">Catálogo de Ferramentas</h2>
            </div>
            <p className="text-neutral-500 mt-0.5">Explore todo o conjunto de ferramentas da bancada PDFpb</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg text-neutral-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {categories.map((cat, i) => (
            <div key={i} className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                {cat.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {cat.tools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <div
                      key={tool.key}
                      onClick={() => {
                        onRunAction(tool.key);
                        onClose();
                      }}
                      className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-[#b70228] bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-750 transition-all cursor-pointer shadow-xs group"
                    >
                      <div className="flex items-center space-x-3 mb-1.5">
                        <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 group-hover:bg-[#b70228] group-hover:text-white transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-100 text-xs">
                          {tool.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 leading-relaxed pl-1">
                        {tool.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 flex items-center justify-between text-neutral-500 text-[11px]">
          <span>Processamento 100% no seu navegador · Totalmente privado</span>
          <span>Pressione ⌘K a qualquer momento</span>
        </div>
      </div>
    </div>
  );
};
