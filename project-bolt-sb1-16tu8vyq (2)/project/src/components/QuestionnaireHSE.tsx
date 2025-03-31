import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { 
  ClipboardList, 
  Clock, 
  Brain, 
  Users, 
  HeartHandshake, 
  Target, 
  Briefcase,
  HelpCircle,
  AlertCircle,
  UserCog,
  Coffee,
  Calendar,
  Workflow,
  MessageSquare,
  HandMetal,
  UserCheck,
  Scale,
  Lightbulb,
  Megaphone,
  Shield,
  Puzzle,
  Laptop,
  BookOpen,
  Zap,
  Heart,
  Smile,
  Frown,
  Building2,
  Headphones,
  ScrollText,
  Settings,
  Hammer,
  FileCheck,
  Glasses,
  BadgeCheck,
  ShieldCheck,
  Download,
  Loader2,
  RotateCcw
} from 'lucide-react';
import { Question, Domain, Response, DomainResult, CompanyInfo } from '../types/assessment';
import { calculateDomainResults } from '../utils/riskCalculator';
import { RiskChart } from './RiskChart';
import { ProgressDisplay } from './ProgressDisplay';
import { EmployeeCountForm } from './EmployeeCountForm';
import { AssessmentPDF } from './AssessmentPDF';
import { supabase, SYSTEM_PASSWORD } from '../lib/supabase';
import { PasswordPrompt } from './PasswordPrompt';

const questions: Question[] = [
  // DEMANDA
  {
    id: 1,
    text: "Tenho que trabalhar muito intensamente",
    domain: "DEMANDA",
    icon: Brain,
    tooltip: "Esta questão avalia o nível de esforço mental necessário no seu trabalho. Considere a quantidade de concentração, atenção e processamento mental que suas tarefas exigem diariamente."
  },
  {
    id: 2,
    text: "Tenho que negligenciar algumas tarefas porque tenho muito trabalho",
    domain: "DEMANDA",
    icon: Clock,
    tooltip: "Avalia se você precisa deixar de lado algumas atividades devido ao volume de trabalho. Pense se você consegue completar todas as suas tarefas ou se precisa priorizar algumas em detrimento de outras."
  },
  {
    id: 3,
    text: "Tenho prazos impossíveis de cumprir",
    domain: "DEMANDA",
    icon: Calendar,
    tooltip: "Refere-se à realidade dos prazos estabelecidos para suas tarefas. Considere se os prazos são razoáveis e se você consegue entregar seu trabalho com qualidade dentro do tempo determinado."
  },
  {
    id: 4,
    text: "Trabalho sob pressão de tempo",
    domain: "DEMANDA",
    icon: AlertCircle,
    tooltip: "Avalia o nível de pressão temporal que você experimenta. Pense na frequência com que você se sente pressionado para completar tarefas rapidamente ou com urgência."
  },
  {
    id: 5,
    text: "Tenho que fazer meu trabalho com muita rapidez",
    domain: "DEMANDA",
    icon: Workflow,
    tooltip: "Analisa se você precisa executar suas tarefas em um ritmo acelerado. Considere se a velocidade exigida é compatível com a qualidade esperada do trabalho."
  },
  {
    id: 6,
    text: "Preciso fazer horas extras com frequência",
    domain: "DEMANDA",
    icon: Clock,
    tooltip: "Avalia a necessidade de trabalhar além do horário normal. Considere a frequência com que você precisa estender seu dia de trabalho para dar conta das demandas."
  },
  {
    id: 7,
    text: "Minhas tarefas são frequentemente interrompidas antes de serem completadas",
    domain: "DEMANDA",
    icon: AlertCircle,
    tooltip: "Analisa as interrupções no seu fluxo de trabalho. Pense na frequência com que você precisa parar uma tarefa para atender outras demandas urgentes."
  },

  // CONTROLE
  {
    id: 8,
    text: "Posso decidir quando fazer uma pausa",
    domain: "CONTROLE",
    icon: Coffee,
    tooltip: "Avalia sua autonomia para fazer pausas durante o trabalho. Considere se você tem liberdade para decidir quando precisa de um momento de descanso ou intervalo."
  },
  {
    id: 9,
    text: "Posso decidir como fazer meu trabalho",
    domain: "CONTROLE",
    icon: UserCog,
    tooltip: "Refere-se à sua liberdade para escolher métodos e formas de realizar suas tarefas. Pense se você pode usar sua criatividade e experiência para definir como executar seu trabalho."
  },
  {
    id: 10,
    text: "Posso escolher o que fazer no trabalho",
    domain: "CONTROLE",
    icon: Target,
    tooltip: "Avalia seu nível de autonomia na escolha das atividades. Considere se você tem flexibilidade para definir prioridades e selecionar quais tarefas realizar primeiro."
  },
  {
    id: 11,
    text: "Tenho flexibilidade nos meus horários de trabalho",
    domain: "CONTROLE",
    icon: Clock,
    tooltip: "Analisa sua liberdade para ajustar seus horários de trabalho. Pense se você pode adaptar seu horário de acordo com suas necessidades, dentro dos limites estabelecidos."
  },
  {
    id: 12,
    text: "Tenho controle sobre o ritmo do meu trabalho",
    domain: "CONTROLE",
    icon: Settings,
    tooltip: "Avalia se você pode controlar a velocidade com que realiza suas tarefas. Considere se pode ajustar o ritmo de trabalho de acordo com sua capacidade e as demandas."
  },

  // SUPORTE_GESTAO
  {
    id: 13,
    text: "Recebo feedback construtivo sobre meu trabalho",
    domain: "SUPORTE_GESTAO",
    icon: MessageSquare,
    tooltip: "Avalia a qualidade do retorno que você recebe sobre seu desempenho. Considere se os feedbacks são úteis, construtivos e ajudam no seu desenvolvimento profissional."
  },
  {
    id: 14,
    text: "Posso contar com o apoio do meu supervisor quando preciso",
    domain: "SUPORTE_GESTAO",
    icon: HeartHandshake,
    tooltip: "Analisa o suporte que você recebe da sua liderança. Pense se seu supervisor está disponível quando você precisa de ajuda ou orientação."
  },
  {
    id: 15,
    text: "Recebo informações claras sobre mudanças no trabalho",
    domain: "SUPORTE_GESTAO",
    icon: Megaphone,
    tooltip: "Avalia a transparência na comunicação sobre mudanças. Considere se você é informado adequadamente sobre alterações que afetam seu trabalho."
  },
  {
    id: 16,
    text: "Meu supervisor me incentiva no trabalho",
    domain: "SUPORTE_GESTAO",
    icon: Lightbulb,
    tooltip: "Analisa o nível de motivação e encorajamento que você recebe. Pense se seu supervisor reconhece seus esforços e incentiva seu desenvolvimento."
  },
  {
    id: 17,
    text: "Minha liderança demonstra preocupação com meu bem-estar",
    domain: "SUPORTE_GESTAO",
    icon: Heart,
    tooltip: "Avalia se seus superiores se preocupam com sua saúde e bem-estar. Considere se há atenção às suas necessidades pessoais e profissionais."
  },

  // SUPORTE_PARES
  {
    id: 18,
    text: "Recebo ajuda e suporte dos colegas",
    domain: "SUPORTE_PARES",
    icon: Users,
    tooltip: "Avalia o apoio que você recebe de seus colegas de trabalho. Pense na disposição deles em ajudar quando você precisa de assistência."
  },
  {
    id: 19,
    text: "Meus colegas me escutam quando tenho problemas no trabalho",
    domain: "SUPORTE_PARES",
    icon: Headphones,
    tooltip: "Analisa o suporte emocional entre colegas. Considere se você pode compartilhar suas preocupações e se sente ouvido por seus pares."
  },
  {
    id: 20,
    text: "Existe um ambiente de cooperação entre a equipe",
    domain: "SUPORTE_PARES",
    icon: HandMetal,
    tooltip: "Avalia o espírito de equipe e colaboração no ambiente de trabalho. Pense se as pessoas trabalham juntas de forma cooperativa."
  },
  {
    id: 21,
    text: "Posso confiar nos meus colegas de trabalho",
    domain: "SUPORTE_PARES",
    icon: ShieldCheck,
    tooltip: "Analisa o nível de confiança entre colegas. Considere se você pode contar com a discrição e apoio dos seus pares."
  },

  // RELACIONAMENTOS
  {
    id: 22,
    text: "Existe respeito mútuo no ambiente de trabalho",
    domain: "RELACIONAMENTOS",
    icon: HeartHandshake,
    tooltip: "Avalia o nível de respeito entre todas as pessoas no trabalho. Pense se há tratamento cordial e profissional entre todos os níveis hierárquicos."
  },
  {
    id: 23,
    text: "As relações no trabalho são harmoniosas",
    domain: "RELACIONAMENTOS",
    icon: Smile,
    tooltip: "Analisa a qualidade geral das relações interpessoais. Considere se o ambiente é agradável e se as pessoas se relacionam bem."
  },
  {
    id: 24,
    text: "Há conflitos frequentes no ambiente de trabalho",
    domain: "RELACIONAMENTOS",
    icon: Frown,
    tooltip: "Avalia a frequência de desentendimentos e conflitos. Pense na ocorrência de situações tensas ou desagradáveis entre as pessoas."
  },
  {
    id: 25,
    text: "A comunicação é efetiva entre as equipes",
    domain: "RELACIONAMENTOS",
    icon: MessageSquare,
    tooltip: "Analisa a qualidade da comunicação entre diferentes equipes. Considere se as informações fluem bem e se há clareza nas trocas."
  },

  // FUNCAO
  {
    id: 26,
    text: "Sei exatamente quais são minhas responsabilidades",
    domain: "FUNCAO",
    icon: ScrollText,
    tooltip: "Avalia a clareza sobre suas atribuições e deveres. Pense se você tem um entendimento claro do que se espera do seu trabalho."
  },
  {
    id: 27,
    text: "Sei como meu trabalho contribui para os objetivos da organização",
    domain: "FUNCAO",
    icon: Target,
    tooltip: "Analisa sua compreensão sobre como seu trabalho impacta os resultados da empresa. Considere se você entende a importância do seu papel."
  },
  {
    id: 28,
    text: "Recebo treinamento adequado para realizar minhas tarefas",
    domain: "FUNCAO",
    icon: BookOpen,
    tooltip: "Avalia se você recebe a capacitação necessária. Pense se os treinamentos oferecidos são suficientes para realizar bem seu trabalho."
  },
  {
    id: 29,
    text: "Tenho recursos adequados para realizar meu trabalho",
    domain: "FUNCAO",
    icon: Hammer,
    tooltip: "Analisa se você tem acesso aos recursos necessários. Considere se as ferramentas, equipamentos e materiais são adequados."
  },
  {
    id: 30,
    text: "Minhas habilidades são bem aproveitadas no trabalho",
    domain: "FUNCAO",
    icon: Zap,
    tooltip: "Avalia se suas competências são utilizadas adequadamente. Pense se seu potencial está sendo bem aproveitado nas suas funções."
  },

  // MUDANCA
  {
    id: 31,
    text: "Sou consultado sobre mudanças que afetam meu trabalho",
    domain: "MUDANCA",
    icon: UserCheck,
    tooltip: "Avalia sua participação em decisões sobre mudanças. Considere se sua opinião é solicitada quando há alterações que afetam seu trabalho."
  },
  {
    id: 32,
    text: "Entendo como as mudanças se relacionam com os objetivos da empresa",
    domain: "MUDANCA",
    icon: Puzzle,
    tooltip: "Analisa sua compreensão sobre o propósito das mudanças. Pense se você entende como as alterações contribuem para os objetivos organizacionais."
  },
  {
    id: 33,
    text: "As mudanças são bem planejadas e implementadas",
    domain: "MUDANCA",
    icon: FileCheck,
    tooltip: "Avalia a qualidade do planejamento e execução das mudanças. Considere se as transformações são conduzidas de forma organizada e eficiente."
  },
  {
    id: 34,
    text: "Tenho tempo suficiente para me adaptar às mudanças",
    domain: "MUDANCA",
    icon: Clock,
    tooltip: "Analisa se o tempo de adaptação às mudanças é adequado. Pense se você recebe prazo suficiente para se ajustar a novas situações."
  },
  {
    id: 35,
    text: "Recebo suporte durante processos de mudança",
    domain: "MUDANCA",
    icon: Shield,
    tooltip: "Avalia o apoio recebido durante transformações. Considere se você recebe orientação e suporte necessários para lidar com as mudanças."
  }
];

const domainQuestions: Record<Domain, number[]> = {
  DEMANDA: [1, 2, 3, 4, 5, 6, 7],
  CONTROLE: [8, 9, 10, 11, 12],
  SUPORTE_GESTAO: [13, 14, 15, 16, 17],
  SUPORTE_PARES: [18, 19, 20, 21],
  RELACIONAMENTOS: [22, 23, 24, 25],
  FUNCAO: [26, 27, 28, 29, 30],
  MUDANCA: [31, 32, 33, 34, 35]
};

const validationSchema = Yup.object().shape(
  questions.reduce((acc, question) => ({
    ...acc,
    [`pergunta_${question.id}`]: Yup.number()
      .required('Obrigatório')
      .min(1, 'Selecione um valor')
      .max(5, 'Selecione um valor')
  }), {})
);

const initialValues = questions.reduce((acc, question) => ({
  ...acc,
  [`pergunta_${question.id}`]: ''
}), {});

export const QuestionnaireHSE: React.FC = () => {
  const [step, setStep] = useState<'password' | 'setup' | 'questionnaire' | 'progress' | 'results'>('password');
  const [results, setResults] = useState<DomainResult[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    totalEmployees: 0,
    completedAssessments: 0,
    requiredAssessments: 0,
    progressPercentage: 0
  });
  const [showPDF, setShowPDF] = useState(false);
  const [empresaId, setEmpresaId] = useState<string>('c81d4e2e-bcf2-4c1a-b275-9183a9f6a176');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePasswordSubmit = (password: string) => {
    if (password === SYSTEM_PASSWORD) {
      setStep('setup');
      setError(null);
    } else {
      setError('Senha incorreta. Por favor, tente novamente.');
    }
  };

  const handleEmployeeCountSubmit = (employeeCount: number) => {
    const requiredAssessments = Math.ceil(employeeCount * 0.8);
    setCompanyInfo({
      totalEmployees: employeeCount,
      completedAssessments: 0,
      requiredAssessments,
      progressPercentage: 0
    });
    setStep('questionnaire');
  };

  const handleSubmit = async (values: Record<string, string>, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      const respostas: Response[] = Object.entries(values).map(([key, value]) => ({
        perguntaId: parseInt(key.replace('pergunta_', '')),
        valor: parseInt(value)
      }));

      const domainResults = calculateDomainResults(respostas, domainQuestions);
      setResults(domainResults);

      const newCompletedAssessments = companyInfo.completedAssessments + 1;
      const newProgressPercentage = (newCompletedAssessments / companyInfo.requiredAssessments) * 100;

      const updatedCompanyInfo = {
        ...companyInfo,
        completedAssessments: newCompletedAssessments,
        progressPercentage: newProgressPercentage
      };
      setCompanyInfo(updatedCompanyInfo);

      const { error: saveError } = await supabase
        .from('avaliacoes')
        .insert([
          {
            empresa_id: empresaId,
            respostas: respostas,
            resultados: domainResults
          }
        ]);

      if (saveError) throw saveError;

      if (newProgressPercentage >= 100) {
        setStep('results');
      } else {
        setStep('progress');
      }

    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
      alert(error instanceof Error ? error.message : 'Erro ao salvar avaliação. Por favor, tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const startNewAssessment = () => {
    setStep('questionnaire');
  };

  const handleFinalize = async (password: string) => {
    setLoading(true);
    try {
      if (password !== SYSTEM_PASSWORD) {
        throw new Error('Senha incorreta. Por favor, tente novamente.');
      }
      setStep('results');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao finalizar avaliações.');
    } finally {
      setLoading(false);
    }
  };

  const restartProcess = () => {
    setStep('password');
    setResults([]);
    setCompanyInfo({
      totalEmployees: 0,
      completedAssessments: 0,
      requiredAssessments: 0,
      progressPercentage: 0
    });
    setShowPDF(false);
    setError(null);
  };

  const renderContent = () => {
    switch (step) {
      case 'password':
        return (
          <PasswordPrompt
            onSubmit={handlePasswordSubmit}
            title="Iniciar Avaliação"
            description="Digite a senha do sistema para começar"
            loading={loading}
            error={error}
          />
        );

      case 'setup':
        return <EmployeeCountForm onSubmit={handleEmployeeCountSubmit} />;

      case 'questionnaire':
        return (
          <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <ClipboardList className="w-12 h-12 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Avaliação HSE-IT</h1>
              <p className="text-gray-600">
                Por favor, avalie cada afirmação em uma escala de 1 (Nunca) a 5 (Sempre)
              </p>
            </div>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form className="space-y-6">
                  {questions.map((question) => {
                    const Icon = question.icon;
                    return (
                      <div key={question.id} className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="mb-4">
                          <div className="flex items-center gap-3 mb-2">
                            <Icon className="w-5 h-5 text-blue-600" />
                            <label className="block text-gray-800 font-medium">
                              {question.text}
                            </label>
                            <div className="relative group">
                              <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-sm rounded p-2 w-64 z-10">
                                {question.tooltip}
                              </div>
                            </div>
                          </div>
                          <Field
                            as="select"
                            name={`pergunta_${question.id}`}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Selecione uma opção</option>
                            <option value="1">1 - Nunca</option>
                            <option value="2">2 - Raramente</option>
                            <option value="3">3 - Às vezes</option>
                            <option value="4">4 - Frequentemente</option>
                            <option value="5">5 - Sempre</option>
                          </Field>
                          {errors[`pergunta_${question.id}`] && touched[`pergunta_${question.id}`] && (
                            <div className="text-red-500 text-sm mt-1">
                              {errors[`pergunta_${question.id}`]}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Enviar Avaliação
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        );

      case 'progress':
        if (companyInfo.progressPercentage >= 80) {
          return (
            <div className="max-w-xl mx-auto p-6 space-y-8">
              <ProgressDisplay
                companyInfo={companyInfo}
                onStartNewAssessment={startNewAssessment}
              />
              <PasswordPrompt
                onSubmit={handleFinalize}
                title="Finalizar Avaliações"
                description="Digite a senha do sistema para finalizar e ver os resultados"
                loading={loading}
                error={error}
              />
            </div>
          );
        }
        return (
          <div className="max-w-xl mx-auto p-6">
            <ProgressDisplay
              companyInfo={companyInfo}
              onStartNewAssessment={startNewAssessment}
            />
          </div>
        );

      case 'results':
        return (
          <div className="max-w-4xl mx-auto p-6 space-y-8">
            <h2 className="text-2xl font-bold text-center text-gray-900">Resultados da Avaliação</h2>
            <RiskChart results={results} />
            
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowPDF(!showPDF)}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Download className="w-5 h-5" />
                {showPDF ? 'Ocultar PDF' : 'Visualizar PDF'}
              </button>
              
              <button
                onClick={restartProcess}
                className="flex items-center gap-2 bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                <RotateCcw className="w-5 h-5" />
                Iniciar Novo Processo
              </button>
            </div>

            {showPDF && (
              <div className="mt-8">
                <AssessmentPDF
                  results={results}
                  companyInfo={{
                    totalEmployees: companyInfo.totalEmployees,
                    completedAssessments: companyInfo.completedAssessments
                  }}
                />
              </div>
            )}
          </div>
        );
    }
  };

  return renderContent();
};