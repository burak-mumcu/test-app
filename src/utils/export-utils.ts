/**
 * Export utilities for HAR, CSV, HTML formats
 */

import type { Section, Endpoint, Scenario, ScenarioResult } from '../types';

export interface HAREntry {
  startedDateTime: string;
  time: number;
  request: {
    method: string;
    url: string;
    headers: Array<{ name: string; value: string }>;
    postData?: {
      mimeType: string;
      text: string;
    };
  };
  response: {
    status: number;
    statusText: string;
    headers: Array<{ name: string; value: string }>;
    content: {
      size: number;
      mimeType: string;
      text: string;
    };
  };
}

export function exportToHAR(sections: Section[], results: Record<string, any>): string {
  const entries: HAREntry[] = [];

  sections.forEach(section => {
    section.endpoints.forEach(endpoint => {
      endpoint.scenarios.forEach(scenario => {
        const result = results[section.id]?.[endpoint.id]?.[scenario.id];
        if (!result) return;

        const url = new URL(endpoint.path, section.baseUrl).toString();
        const headers = scenario.headers || {};
        const headerArray = Object.entries(headers).map(([name, value]) => ({ name, value }));

        entries.push({
          startedDateTime: new Date(result.startedAt).toISOString(),
          time: result.responseTime || 0,
          request: {
            method: endpoint.method,
            url,
            headers: headerArray,
            ...(scenario.requestBody && {
              postData: {
                mimeType: 'application/json',
                text: scenario.requestBody
              }
            })
          },
          response: {
            status: result.actualStatus || 0,
            statusText: result.status === 'pass' ? 'OK' : 'Error',
            headers: Object.entries(result.responseHeaders || {}).map(([name, value]) => ({ name, value: String(value) })),
            content: {
              size: result.responseBody?.length || 0,
              mimeType: 'application/json',
              text: result.responseBody || ''
            }
          }
        });
      });
    });
  });

  const har = {
    log: {
      version: '1.2',
      creator: {
        name: 'API Test App',
        version: '1.0'
      },
      entries
    }
  };

  return JSON.stringify(har, null, 2);
}

export function exportToCSV(sections: Section[], results: Record<string, any>): string {
  const rows: string[] = [];
  rows.push('Section,Endpoint,Scenario,Method,URL,Status,Expected Status,Response Time,Result,Error');

  sections.forEach(section => {
    section.endpoints.forEach(endpoint => {
      endpoint.scenarios.forEach(scenario => {
        const result = results[section.id]?.[endpoint.id]?.[scenario.id];
        const url = new URL(endpoint.path, section.baseUrl).toString();
        
        const row = [
          escapeCSV(section.name),
          escapeCSV(endpoint.name),
          escapeCSV(scenario.name),
          endpoint.method,
          escapeCSV(url),
          result?.actualStatus?.toString() || '',
          scenario.expectedStatus.toString(),
          result?.responseTime?.toString() || '',
          result?.status || 'pending',
          escapeCSV(result?.errorMessage || '')
        ];
        
        rows.push(row.join(','));
      });
    });
  });

  return rows.join('\n');
}

function escapeCSV(value: string): string {
  if (!value) return '';
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportToHTML(sections: Section[], results: Record<string, any>): string {
  let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>API Test Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
    h1 { color: #333; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #4CAF50; color: white; }
    tr:hover { background-color: #f5f5f5; }
    .pass { color: #22c55e; font-weight: bold; }
    .fail { color: #ef4444; font-weight: bold; }
    .pending { color: #3b82f6; }
    .summary { background: #e3f2fd; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>API Test Report</h1>
    <div class="summary">
      <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
    </div>
    <table>
      <thead>
        <tr>
          <th>Section</th>
          <th>Endpoint</th>
          <th>Scenario</th>
          <th>Method</th>
          <th>URL</th>
          <th>Status</th>
          <th>Expected</th>
          <th>Response Time</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>`;

  sections.forEach(section => {
    section.endpoints.forEach(endpoint => {
      endpoint.scenarios.forEach(scenario => {
        const result = results[section.id]?.[endpoint.id]?.[scenario.id];
        const url = new URL(endpoint.path, section.baseUrl).toString();
        const statusClass = result?.status || 'pending';
        
        html += `
        <tr>
          <td>${escapeHTML(section.name)}</td>
          <td>${escapeHTML(endpoint.name)}</td>
          <td>${escapeHTML(scenario.name)}</td>
          <td>${endpoint.method}</td>
          <td>${escapeHTML(url)}</td>
          <td>${result?.actualStatus || '-'}</td>
          <td>${scenario.expectedStatus}</td>
          <td>${result?.responseTime ? result.responseTime + 'ms' : '-'}</td>
          <td class="${statusClass}">${result?.status?.toUpperCase() || 'PENDING'}</td>
        </tr>`;
      });
    });
  });

  html += `
      </tbody>
    </table>
  </div>
</body>
</html>`;

  return html;
}

function escapeHTML(text: string): string {
  if (typeof window === 'undefined') {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

