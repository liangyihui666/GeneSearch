import { evidenceRecords, getRecordTherapies, getReferencedTherapyCount, searchEvidence } from './geneEvidence'
import { therapyById, therapyRecords } from './therapyCatalog'

describe('biomarker evidence data gate', () => {
  it('publishes at least 15 markers and 45 unique domestic therapies', () => {
    expect(evidenceRecords.length).toBeGreaterThanOrEqual(15)
    expect(getReferencedTherapyCount()).toBeGreaterThanOrEqual(45)
  })

  it('keeps therapy ids unique and resolves every therapy use', () => {
    expect(new Set(therapyRecords.map((therapy) => therapy.id)).size).toBe(therapyRecords.length)
    for (const record of evidenceRecords) for (const group of record.evidenceGroups) for (const therapyUse of group.therapyUses) {
      expect(therapyById.has(therapyUse.therapyId)).toBe(true)
      expect(therapyUse.approvalSource.organization).toContain('国家药品监督管理局')
      expect(therapyUse.approvalSource.url).toMatch(/^https:\/\//)
      expect(therapyUse.approvalSource.checkedAt).toBe('2026-09-01')
    }
  })

  it('searches multiple variants under one marker without depending on spacing', () => {
    expect(searchEvidence('metex14', 'gene').map((item) => item.symbol)).toEqual(['MET'])
    expect(searchEvidence('21号外显子 l858r', 'gene').map((item) => item.symbol)).toEqual(['EGFR'])
    expect(searchEvidence('t790m', 'gene').map((item) => item.symbol)).toEqual(['EGFR'])
    expect(searchEvidence('20号外显子插入', 'gene').map((item) => item.symbol)).toEqual(['EGFR'])
  })

  it('supports generic name, alias and cancer reverse searches', () => {
    expect(searchEvidence('奥凯乐', 'drug').map((item) => item.symbol)).toEqual(['ROS1'])
    expect(searchEvidence('塞普替尼', 'drug').map((item) => item.symbol)).toEqual(['RET'])
    expect(searchEvidence('多发性骨髓瘤', 'cancer').map((item) => item.symbol)).toContain('BCMA')
    expect(searchEvidence('胃癌', 'cancer').map((item) => item.symbol)).toEqual(expect.arrayContaining(['ERBB2 / HER2', 'CLDN18.2']))
  })

  it('deduplicates a therapy used by several evidence groups', () => {
    const egfr = evidenceRecords.find((record) => record.id === 'egfr')!
    expect(getRecordTherapies(egfr).filter((therapy) => therapy.id === 'osimertinib')).toHaveLength(1)
  })

  it('keeps coverage periods separate from approval publication dates', () => {
    for (const therapy of therapyRecords) for (const coverage of therapy.coverage) {
      expect(coverage).not.toHaveProperty('publishedAt')
      if (coverage.validFrom && coverage.validTo) expect(coverage.validFrom <= coverage.validTo).toBe(true)
    }
  })

  it('uses accurate hematologic target types and excludes foreign claims', () => {
    expect(evidenceRecords.find((record) => record.id === 'cd19')?.markerType).toBe('细胞表面靶点')
    expect(evidenceRecords.find((record) => record.id === 'bcma')?.markerType).toBe('细胞表面靶点')
    expect(JSON.stringify(evidenceRecords)).not.toMatch(/FDA|NCCN|ESMO/)
  })
})
