import { evidenceRecords, searchEvidence } from './geneEvidence'

describe('gene evidence search', () => {
  it('searches genes and variants without depending on spacing', () => {
    expect(searchEvidence('metex14', 'gene').map((item) => item.symbol)).toEqual(['MET'])
    expect(searchEvidence('21号外显子 l858r', 'gene').map((item) => item.symbol)).toEqual(['EGFR'])
  })

  it('supports reverse drug and cancer searches', () => {
    expect(searchEvidence('奥凯乐', 'drug').map((item) => item.symbol)).toEqual(['ROS1'])
    expect(searchEvidence('胃癌', 'cancer').map((item) => item.symbol)).toEqual(['ERBB2', 'CLDN18.2'])
  })

  it('marks every record as domestic-source and pending medical review', () => {
    for (const record of evidenceRecords) {
      expect(record.source.organization).toContain('国家药品监督管理局')
      expect(record.contentStatus).toBe('国内官方来源已核对 · 医学文案待审')
    }
  })
})
