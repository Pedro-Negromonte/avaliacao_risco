import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer
} from '@react-pdf/renderer';
import { DomainResult } from '../types/assessment';
import { Company } from '../types/company';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  companyInfo: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  domainSection: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  riskLevel: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 5,
  },
});

interface AssessmentPDFProps {
  results: DomainResult[];
  company: Company;
  companyInfo: {
    totalEmployees: number;
    completedAssessments: number;
  };
}

const getRiskLevelColor = (nivel: string) => {
  switch (nivel) {
    case 'ALTO':
      return '#dc3545';
    case 'MODERADO':
      return '#ffc107';
    case 'BAIXO':
      return '#28a745';
    default:
      return '#000000';
  }
};

export const AssessmentPDF: React.FC<AssessmentPDFProps> = ({ results, company, companyInfo }) => {
  const formatDate = () => {
    return new Date().toLocaleDateString('pt-BR');
  };

  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  };

  return (
    <PDFViewer style={{ width: '100%', height: '600px' }}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.title}>Relatório de Avaliação HSE-IT</Text>
            <Text style={styles.text}>Data: {formatDate()}</Text>
          </View>

          <View style={styles.companyInfo}>
            <Text style={styles.subtitle}>Dados da Empresa</Text>
            <Text style={styles.text}>Razão Social: {company.razaoSocial}</Text>
            <Text style={styles.text}>CNPJ: {formatCNPJ(company.cnpj)}</Text>
            <Text style={styles.text}>Total de Funcionários: {companyInfo.totalEmployees}</Text>
            <Text style={styles.text}>Avaliações Realizadas: {companyInfo.completedAssessments}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.subtitle}>Resultados por Domínio</Text>
            
            {results.map((result, index) => (
              <View key={index} style={styles.domainSection}>
                <Text style={styles.subtitle}>{result.dominio}</Text>
                <Text style={styles.text}>Média: {result.media.toFixed(2)}</Text>
                <Text style={{
                  ...styles.riskLevel,
                  color: getRiskLevelColor(result.nivelRisco.nivel),
                }}>
                  Nível de Risco: {result.nivelRisco.nivel}
                </Text>
                
                <Text style={styles.text}>Recomendações:</Text>
                {result.recomendacoes.map((rec, idx) => (
                  <Text key={idx} style={styles.text}>• {rec}</Text>
                ))}
              </View>
            ))}
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};