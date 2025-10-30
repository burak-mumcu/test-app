import type { SectionResult, ScenarioResult } from '../types';

export interface TestReport {
  totalTests: number;
  passed: number;
  failed: number;
  pending: number;
  successRate: number;
  averageResponseTime: number;
  totalResponseTime: number;
  fastestTest: number | null;
  slowestTest: number | null;
}

export interface SectionReport extends TestReport {
  sectionId: string;
  sectionName: string;
  endpointReports: EndpointReport[];
}

export interface EndpointReport extends TestReport {
  endpointId: string;
  endpointName: string;
  scenarioReports: ScenarioReport[];
}

export interface ScenarioReport {
  scenarioId: string;
  scenarioName: string;
  status: 'pending' | 'pass' | 'fail';
  responseTime?: number;
  errorMessage?: string;
}

class ReportService {
  calculateScenarioReports(scenarios: any[], results: ScenarioResult[]): ScenarioReport[] {
    return scenarios.map((sc) => {
      const result = results.find((r) => r.scenarioId === sc.id);
      return {
        scenarioId: sc.id,
        scenarioName: sc.name,
        status: result?.status ?? 'pending',
        responseTime: result?.responseTime,
        errorMessage: result?.errorMessage
      };
    });
  }

  calculateTestReport(results: ScenarioResult[]): TestReport {
    const totalTests = results.length;
    const passed = results.filter((r) => r.status === 'pass').length;
    const failed = results.filter((r) => r.status === 'fail').length;
    const pending = results.filter((r) => r.status === 'pending').length;
    
    const responseTimes = results
      .map((r) => r.responseTime)
      .filter((rt): rt is number => rt !== undefined);
    
    const totalResponseTime = responseTimes.reduce((sum, rt) => sum + rt, 0);
    const averageResponseTime = responseTimes.length > 0 ? totalResponseTime / responseTimes.length : 0;
    const fastestTest = responseTimes.length > 0 ? Math.min(...responseTimes) : null;
    const slowestTest = responseTimes.length > 0 ? Math.max(...responseTimes) : null;
    
    return {
      totalTests,
      passed,
      failed,
      pending,
      successRate: totalTests > 0 ? (passed / totalTests) * 100 : 0,
      averageResponseTime,
      totalResponseTime,
      fastestTest,
      slowestTest
    };
  }

  generateEndpointReport(
    endpoint: any,
    results: ScenarioResult[]
  ): EndpointReport {
    const scenarioReports = this.calculateScenarioReports(endpoint.scenarios, results);
    const testReport = this.calculateTestReport(results);
    
    return {
      ...testReport,
      endpointId: endpoint.id,
      endpointName: endpoint.name,
      scenarioReports
    };
  }

  generateSectionReport(
    section: any,
    sectionResult: SectionResult | undefined
  ): SectionReport {
    const allResults: ScenarioResult[] = [];
    const endpointReports: EndpointReport[] = [];

    section.endpoints.forEach((ep: any) => {
      const endpointResult = sectionResult?.endpoints.find((er) => er.endpointId === ep.id);
      const endpointResults = endpointResult?.results ?? [];
      allResults.push(...endpointResults);
      endpointReports.push(this.generateEndpointReport(ep, endpointResults));
    });

    const testReport = this.calculateTestReport(allResults);

    return {
      ...testReport,
      sectionId: section.id,
      sectionName: section.name,
      endpointReports
    };
  }

  generateFullReport(sections: any[], results: Record<string, SectionResult>): {
    summary: TestReport;
    sections: SectionReport[];
  } {
    const allResults: ScenarioResult[] = [];
    const sectionReports: SectionReport[] = [];

    sections.forEach((section) => {
      const sectionResult = results[section.id];
      const sectionReport = this.generateSectionReport(section, sectionResult);
      sectionReports.push(sectionReport);
      
      sectionReport.endpointReports.forEach((er) => {
        allResults.push(...er.scenarioReports.map((sr) => {
          const result = sectionResult?.endpoints
            .find((e) => e.endpointId === er.endpointId)
            ?.results.find((r) => r.scenarioId === sr.scenarioId);
          return result as ScenarioResult;
        }).filter((r): r is ScenarioResult => r !== undefined));
      });
    });

    const summary = this.calculateTestReport(allResults);

    return {
      summary,
      sections: sectionReports
    };
  }
}

export const reportService = new ReportService();

