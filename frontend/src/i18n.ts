// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      login: "Login",
      username: "Username",
      password: "Password",
      email: "Email",
      register: "Register",
      dashboard: "Dashboard",
      upload_invoices: "Upload Invoices",
      logout: "Logout",
      personal_finance_tracker: "ServiTracker",
      language: "Language",
      welcome: "Welcome",
      no_account: "Don't have an account? Register here",
      have_account: "Already have an account? Login here",
      enter: "Enter",
      register_now: "Register now",
      upload_invoice: "Upload Invoice",
      select_file: "Select a file",
      send: "Send",
      file_required: "Please select a file to upload.",
      file_uploaded: "Invoice uploaded successfully!",
      error_upload: "Error uploading invoice.",
      invalid_credentials: "Invalid credentials",
      account_created: "Account created successfully! You can now log in.",
      error_register: "Error registering",
      financial_overview: "Financial Overview",
      financial_health: "Financial Balance",
      salary: "Salary",
      investments: "Investments",
      others: "Others",
      total_income: "Total Income",
      table_view: "View Table",
      chart_view: "View Chart",
      income_details: "Income Details",
      month: "Month",
      actions: "Actions",
      confirm_delete: "Delete",
      are_you_sure_delete: "Are you sure you want to delete?",
      row_deleted: "Record deleted",
      view_details: "View Details",
      refresh: "Refresh",
      notifications: "Notifications",
      recent_activity: "Recent Activity",
      months6later: "Last 6 Months",
      new_invoice_uploaded: "New Invoice Uploaded",
      hours_ago: "{{hour}} hours ago",
      switch_language: "Switch Language",
      dark_mode: "Dark Mode",
      light_mode: "Light Mode"

      
      // Outras traduções necessárias...
    }
  },
  pt: {
    translation: {
      login: "Login",
      username: "Nome de Utilizador",
      password: "Palavra-passe",
      email: "Email",
      register: "Registar",
      dashboard: "Painel de Controle",
      upload_invoices: "Carregar Faturas",
      logout: "Sair",
      personal_finance_tracker: "ServiTracker",
      language: "Idioma",
      welcome: "Bem-vindo",
      no_account: "Não tem conta? Registe-se aqui",
      have_account: "Já tem conta? Faça login aqui",
      enter: "Entrar",
      register_now: "Registe-se agora",
      upload_invoice: "Upload de Fatura",
      select_file: "Selecione um ficheiro",
      send: "Enviar",
      file_required: "Selecione um ficheiro para upload.",
      file_uploaded: "Fatura carregada com sucesso!",
      error_upload: "Erro ao enviar a fatura.",
      invalid_credentials: "Credenciais inválidas",
      account_created: "Conta criada com sucesso! Pode fazer login.",
      error_register: "Erro ao registar",
      financial_overview: "Visão Global de Rendimentos",
      financial_health: "Saude Financeira",
      salary: "Salário",
      investments: "Investimentos",
      others: "Outros",
      total_income: "Saldo Total",
      table_view: "Ver Tabela",
      chart_view: "Ver Gráfico",
      income_details: "Detalhes de Rendimentos",
      month: "Mês",
      actions: "Ações",
      confirm_delete: "Apagar",
      are_you_sure_delete: "Tem a certeza que pretende apagar?",
      row_deleted: "Registo apagado",
      view_details: "Ver Detalhes",
      refresh: "Atualizar",
      notifications: "Notificações",
      recent_activity: "Atividade Recente",
      months6later: "Últimos 6 Meses",
      new_invoice_uploaded: "Envio de Nova Fatura",
      hours_ago: "{{hour}} horas atrás",
      switch_language: "Mudar Língua",
      dark_mode: "Modo Escuro",
      light_mode: "Modo Claro"
      // Outras traduções necessárias...
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "pt", // idioma por defeito
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;
