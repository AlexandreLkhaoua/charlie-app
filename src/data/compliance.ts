import { ComplianceStatus, TaxInfo, USAccount } from '@/types'

export const complianceData: ComplianceStatus[] = [
  {
    clientId: 'client-001',
    kycStatus: 'Valid',
    kycExpiry: '2025-06-15',
    amlCheck: 'Clear',
    fatcaStatus: 'Compliant',
    suitability: 'Appropriate',
    lastReview: '2024-10-15',
    issues: [],
  },
  {
    clientId: 'client-002',
    kycStatus: 'Valid',
    kycExpiry: '2025-03-20',
    amlCheck: 'Clear',
    fatcaStatus: 'Compliant',
    suitability: 'Appropriate',
    lastReview: '2024-11-01',
    issues: [
      {
        type: 'Documentation',
        severity: 'Low',
        description: 'Annual trust document update pending',
        dueDate: '2025-01-15',
      },
    ],
  },
  {
    clientId: 'client-003',
    kycStatus: 'Expiring',
    kycExpiry: '2024-12-31',
    amlCheck: 'Clear',
    fatcaStatus: 'Compliant',
    suitability: 'Review Required',
    lastReview: '2024-09-20',
    issues: [
      {
        type: 'KYC Renewal',
        severity: 'High',
        description: 'KYC documents expiring in 17 days',
        dueDate: '2024-12-31',
      },
      {
        type: 'Suitability',
        severity: 'Medium',
        description: 'Risk profile review required - aggressive allocation',
        dueDate: '2024-12-20',
      },
    ],
  },
  {
    clientId: 'client-004',
    kycStatus: 'Valid',
    kycExpiry: '2025-08-10',
    amlCheck: 'Review',
    fatcaStatus: 'Compliant',
    suitability: 'Appropriate',
    lastReview: '2024-08-15',
    issues: [
      {
        type: 'AML Review',
        severity: 'Medium',
        description: 'Unusual transaction pattern flagged for review',
        dueDate: '2024-12-20',
      },
    ],
  },
  {
    clientId: 'client-005',
    kycStatus: 'Valid',
    kycExpiry: '2025-09-01',
    amlCheck: 'Clear',
    fatcaStatus: 'Pending',
    suitability: 'Appropriate',
    lastReview: '2024-10-30',
    issues: [
      {
        type: 'FATCA',
        severity: 'High',
        description: 'W-8BEN form update required',
        dueDate: '2024-12-15',
      },
    ],
  },
  {
    clientId: 'client-006',
    kycStatus: 'Valid',
    kycExpiry: '2025-04-20',
    amlCheck: 'Clear',
    fatcaStatus: 'Compliant',
    suitability: 'Appropriate',
    lastReview: '2024-11-10',
    issues: [],
  },
]

export const taxData: TaxInfo[] = [
  {
    clientId: 'client-001',
    taxStatus: 'US Person',
    ssn: '***-**-1234',
    w9Status: 'On File',
    estimatedTax: 1_250_000,
    realizedGains: 3_200_000,
    unrealizedGains: 4_850_000,
    taxLossHarvesting: [
      {
        positionId: 'pos-008',
        symbol: 'AGG',
        currentLoss: 144_500,
        potentialTaxSavings: 54_000,
        washSaleRisk: false,
      },
    ],
  },
  {
    clientId: 'client-002',
    taxStatus: 'US Person',
    w9Status: 'On File',
    estimatedTax: 2_800_000,
    realizedGains: 5_500_000,
    unrealizedGains: 12_000_000,
    taxLossHarvesting: [],
  },
  {
    clientId: 'client-003',
    taxStatus: 'US Person',
    ssn: '***-**-5678',
    w9Status: 'On File',
    estimatedTax: 425_000,
    realizedGains: 1_100_000,
    unrealizedGains: 1_850_000,
    taxLossHarvesting: [],
  },
  {
    clientId: 'client-004',
    taxStatus: 'US Person',
    ssn: '***-**-9012',
    w9Status: 'On File',
    estimatedTax: 85_000,
    realizedGains: -520_000,
    unrealizedGains: -380_000,
    taxLossHarvesting: [
      {
        positionId: 'pos-xyz',
        symbol: 'TLT',
        currentLoss: 245_000,
        potentialTaxSavings: 91_800,
        washSaleRisk: false,
      },
      {
        positionId: 'pos-abc',
        symbol: 'ARKK',
        currentLoss: 135_000,
        potentialTaxSavings: 50_625,
        washSaleRisk: true,
      },
    ],
  },
  {
    clientId: 'client-005',
    taxStatus: 'Non-US Person',
    estimatedTax: 0,
    realizedGains: 4_200_000,
    unrealizedGains: 8_500_000,
    taxLossHarvesting: [],
  },
  {
    clientId: 'client-006',
    taxStatus: 'US Person',
    ssn: '***-**-3456',
    w9Status: 'On File',
    estimatedTax: 185_000,
    realizedGains: 480_000,
    unrealizedGains: 620_000,
    taxLossHarvesting: [],
  },
]

export const usAccounts: USAccount[] = [
  {
    id: 'acc-001',
    clientId: 'client-001',
    type: '401k',
    value: 2_500_000,
    contributions: 23_000,
    withdrawals: 0,
    rmdRequired: false,
  },
  {
    id: 'acc-002',
    clientId: 'client-001',
    type: 'IRA',
    value: 1_800_000,
    contributions: 0,
    withdrawals: 0,
    rmdRequired: false,
  },
  {
    id: 'acc-003',
    clientId: 'client-001',
    type: 'Roth IRA',
    value: 850_000,
    contributions: 7_000,
    withdrawals: 0,
    rmdRequired: false,
  },
  {
    id: 'acc-004',
    clientId: 'client-001',
    type: 'Brokerage',
    value: 39_850_000,
    contributions: 500_000,
    withdrawals: 200_000,
    rmdRequired: false,
  },
  {
    id: 'acc-005',
    clientId: 'client-003',
    type: 'Brokerage',
    value: 6_200_000,
    contributions: 100_000,
    withdrawals: 50_000,
    rmdRequired: false,
  },
  {
    id: 'acc-006',
    clientId: 'client-003',
    type: 'Roth IRA',
    value: 450_000,
    contributions: 7_000,
    withdrawals: 0,
    rmdRequired: false,
  },
  {
    id: 'acc-007',
    clientId: 'client-004',
    type: 'IRA',
    value: 3_200_000,
    contributions: 0,
    withdrawals: 128_000,
    rmdRequired: true,
    rmdAmount: 128_000,
  },
  {
    id: 'acc-008',
    clientId: 'client-004',
    type: 'Trust',
    value: 9_100_000,
    contributions: 0,
    withdrawals: 350_000,
    rmdRequired: false,
  },
  {
    id: 'acc-009',
    clientId: 'client-006',
    type: '401k',
    value: 1_200_000,
    contributions: 23_000,
    withdrawals: 0,
    rmdRequired: false,
  },
  {
    id: 'acc-010',
    clientId: 'client-006',
    type: 'Brokerage',
    value: 3_000_000,
    contributions: 200_000,
    withdrawals: 0,
    rmdRequired: false,
  },
]

export function getComplianceByClientId(clientId: string): ComplianceStatus | undefined {
  return complianceData.find(c => c.clientId === clientId)
}

export function getTaxInfoByClientId(clientId: string): TaxInfo | undefined {
  return taxData.find(t => t.clientId === clientId)
}

export function getAccountsByClientId(clientId: string): USAccount[] {
  return usAccounts.filter(a => a.clientId === clientId)
}

export function getClientsWithComplianceIssues(): string[] {
  return complianceData
    .filter(c => c.issues.length > 0)
    .map(c => c.clientId)
}

export function getTotalComplianceIssues(): number {
  return complianceData.reduce((sum, c) => sum + c.issues.length, 0)
}
