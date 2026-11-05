import type { Metadata } from "next";
import { Header } from "@/components/Header";
import styles from "./privacy.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/politica-de-privacidade" },
  title: "Política de Privacidade",
  description:
    "Saiba como a DescompliCAZA trata dados no site, nas calculadoras e em suas automações internas.",
};

const sections = [
  {
    id: "escopo",
    number: "01",
    title: "Escopo e responsável",
    content: (
      <>
        <p>
          Esta política explica como a <strong>DescompliCAZA</strong>, projeto digital operado
          por Bruno Santos, trata dados pessoais no site, no contato por e-mail e no aplicativo
          interno &quot;n8n Descomplicaza&quot;.
        </p>
        <p>
          A DescompliCAZA atua como controladora dos dados tratados nessas atividades e pode ser
          contatada pelo canal indicado ao final desta página.
        </p>
      </>
    ),
  },
  {
    id: "site",
    number: "02",
    title: "Dados tratados no site",
    content: (
      <>
        <p>
          Os valores informados nas calculadoras são processados no próprio navegador para gerar
          as estimativas exibidas na tela. As marcações do checklist também permanecem apenas na
          página durante a sessão. A DescompliCAZA não recebe nem armazena esses dados.
        </p>
        <p>
          Ao acessar o site, a infraestrutura pode processar dados técnicos mínimos, como endereço
          IP, data e hora, página solicitada, tipo de navegador e registros de erro. Eles são usados
          para entregar as páginas, manter a segurança, prevenir abuso e diagnosticar falhas.
        </p>
        <p>
          Se você entrar em contato por e-mail, serão tratados o endereço de e-mail, nome informado,
          conteúdo da mensagem e eventuais anexos para responder à solicitação e manter o histórico
          necessário do atendimento.
        </p>
      </>
    ),
  },
  {
    id: "finalidades",
    number: "03",
    title: "Finalidades e bases legais",
    content: (
      <>
        <p>Os dados pessoais são tratados somente para:</p>
        <ul>
          <li>operar, proteger e melhorar a estabilidade do site;</li>
          <li>responder a dúvidas, solicitações e contribuições enviadas por e-mail;</li>
          <li>executar as automações internas descritas nesta política; e</li>
          <li>cumprir obrigações legais ou exercer direitos em processos.</li>
        </ul>
        <p>
          Conforme o caso, o tratamento se apoia na execução de procedimentos solicitados pelo
          titular, no legítimo interesse de operar e proteger o serviço, no cumprimento de obrigação
          legal ou regulatória e no exercício regular de direitos, observados os limites da Lei Geral
          de Proteção de Dados Pessoais (LGPD).
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    number: "04",
    title: "Cookies e tecnologias semelhantes",
    content: (
      <>
        <p>
          Na versão atual, a DescompliCAZA não utiliza cookies de publicidade, rastreamento ou
          análise de audiência e não cria perfis de navegação. Os componentes interativos funcionam
          localmente e não usam armazenamento permanente do navegador.
        </p>
        <p>
          Se ferramentas desse tipo forem adicionadas no futuro, esta política será atualizada e,
          quando necessário, será apresentado um mecanismo de escolha antes da ativação.
        </p>
      </>
    ),
  },
  {
    id: "google",
    number: "05",
    title: "Aplicativo interno e dados do Google",
    content: (
      <>
        <p>
          O aplicativo &quot;n8n Descomplicaza&quot; é uma ferramenta de uso interno, não oferecida
          ao público. Ele se conecta somente às contas Google autorizadas pelo próprio operador para
          executar fluxos de trabalho na plataforma n8n.
        </p>
        <p>
          Conforme as permissões concedidas e cada fluxo configurado, o aplicativo pode acessar e
          processar mensagens do Gmail, arquivos do Google Drive e dados do Google Sheets, além de
          realizar ações necessárias à automação, como organizar informações, criar ou atualizar
          arquivos e planilhas e enviar mensagens. O acesso é limitado ao mínimo necessário para
          cada fluxo ativo.
        </p>
        <p>
          Dados obtidos pelas APIs do Google não são vendidos, usados para publicidade, avaliação de
          crédito, vigilância ou treinamento de modelos de inteligência artificial. O uso e a
          transferência desses dados seguem a{" "}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Política de Dados do Usuário dos Serviços de API do Google
          </a>
          , inclusive seus requisitos de Uso Limitado.
        </p>
      </>
    ),
  },
  {
    id: "compartilhamento",
    number: "06",
    title: "Compartilhamento e links externos",
    content: (
      <>
        <p>
          A DescompliCAZA não comercializa dados pessoais. O acesso pode ocorrer por serviços
          estritamente necessários à operação, como Google para as contas conectadas e a
          infraestrutura técnica que entrega o site, sempre limitado à finalidade correspondente.
          Dados também podem ser divulgados por obrigação legal ou ordem válida de autoridade.
        </p>
        <p>
          O site contém links para bancos, órgãos públicos e outros serviços independentes. Ao abrir
          esses endereços, o tratamento passa a seguir as políticas do respectivo terceiro.
        </p>
      </>
    ),
  },
  {
    id: "retencao",
    number: "07",
    title: "Retenção e segurança",
    content: (
      <>
        <p>
          Dados de contato e registros técnicos são mantidos apenas pelo tempo necessário às
          finalidades informadas, à segurança e ao cumprimento de obrigações legais. Depois, são
          eliminados ou anonimizados quando aplicável.
        </p>
        <p>
          No aplicativo interno, credenciais e tokens ficam em ambiente próprio com acesso restrito
          enquanto a conexão e os fluxos estiverem ativos. Informações processadas podem constar nos
          serviços Google de origem ou destino e, quando indispensável ao diagnóstico, em registros
          de execução de acesso restrito.
        </p>
        <p>
          São adotadas medidas técnicas e administrativas razoáveis para reduzir riscos de acesso,
          alteração, perda ou divulgação indevidos. Nenhum sistema, porém, é completamente imune a
          incidentes.
        </p>
      </>
    ),
  },
  {
    id: "direitos",
    number: "08",
    title: "Seus direitos",
    content: (
      <>
        <p>
          Nos termos da LGPD, o titular pode solicitar confirmação do tratamento, acesso, correção,
          informação sobre compartilhamento, anonimização, bloqueio ou eliminação quando cabíveis,
          portabilidade, oposição e revogação do consentimento, sem custo.
        </p>
        <p>
          Pedidos podem ser enviados pelo e-mail abaixo. Para proteger o titular, poderá ser
          solicitada a confirmação de identidade antes do atendimento. Saiba mais na{" "}
          <a
            href="https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados/direito-dos-titulares"
            target="_blank"
            rel="noopener noreferrer"
          >
            página de direitos dos titulares da ANPD
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "revogacao",
    number: "09",
    title: "Revogação do acesso Google",
    content: (
      <p>
        O acesso do aplicativo interno a uma conta Google pode ser revogado a qualquer momento na{" "}
        <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer">
          página de conexões da Conta Google
        </a>
        . Também é possível solicitar a exclusão de credenciais e dados mantidos pela DescompliCAZA
        por meio do canal de contato.
      </p>
    ),
  },
  {
    id: "contato",
    number: "10",
    title: "Atualizações e contato",
    content: (
      <>
        <p>
          Esta política poderá ser atualizada para refletir mudanças no site, nas automações ou na
          legislação. A versão vigente e sua data de atualização permanecerão disponíveis nesta
          página.
        </p>
        <address>
          <strong>DescompliCAZA — responsável por privacidade</strong>
          <a href="mailto:suporte@descomplicaza.com.br">suporte@descomplicaza.com.br</a>
        </address>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main id="top">
      <Header />

      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div>
            <span className={styles.kicker}>Privacidade e transparência</span>
            <h1>Política de Privacidade</h1>
            <p>
              Como a DescompliCAZA trata dados no site, nos canais de contato e em suas automações
              internas.
            </p>
          </div>
          <div className={styles.updated}>
            <span>Última atualização</span>
            <time dateTime="2026-11-04">4 de novembro de 2026</time>
          </div>
        </div>
      </section>

      <section className={styles.content} aria-label="Conteúdo da política de privacidade">
        <div className={`container ${styles.contentGrid}`}>
          <aside className={styles.summary}>
            <span>Em resumo</span>
            <h2>Dados mínimos e uso transparente</h2>
            <p>
              Simulações e marcações ficam no navegador. Dados pessoais só são tratados quando
              necessários à operação, ao contato ou às automações internas autorizadas.
            </p>
            <nav aria-label="Seções desta política">
              {sections.map((section) => (
                <a href={`#${section.id}`} key={section.id}>
                  <span>{section.number}</span>
                  {section.title}
                </a>
              ))}
            </nav>
          </aside>

          <article className={styles.policy}>
            {sections.map((section) => (
              <section id={section.id} key={section.id} className={styles.policySection}>
                <span className={styles.sectionNumber}>{section.number}</span>
                <div>
                  <h2>{section.title}</h2>
                  {section.content}
                </div>
              </section>
            ))}
          </article>
        </div>
      </section>
    </main>
  );
}
