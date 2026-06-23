'use client'

export interface CsvBatchRow {
  recipient: string
  amount: string
  start_time: string
  end_time: string
  cliff_time?: string
  cliff_amount?: string
}

export interface CsvParseResult {
  rows: CsvBatchRow[]
  errors: string[]
}

const EXPECTED_HEADERS = [
  'recipient',
  'amount',
  'start_time',
  'end_time',
  'cliff_time',
  'cliff_amount',
]

function parseCsvLine(line: string): string[] {
  const values: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]

    if (char === '"') {
      const nextChar = line[i + 1]
      if (inQuotes && nextChar === '"') {
        current += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === ',' && !inQuotes) {
      values.push(current)
      current = ''
      continue
    }

    current += char
  }

  values.push(current)
  return values.map((value) => value.trim())
}

function isHeaderRow(row: string[]): boolean {
  const normalized = row.map((value) => value.trim().toLowerCase())
  return EXPECTED_HEADERS.every((header, index) => normalized[index] === header)
}

export function parseCsvBatch(csvText: string): CsvParseResult {
  const lines = csvText
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  const errors: string[] = []
  const rows: CsvBatchRow[] = []

  if (lines.length === 0) {
    return { rows, errors }
  }

  let startIndex = 0
  const firstRow = parseCsvLine(lines[0])
  if (isHeaderRow(firstRow)) {
    startIndex = 1
  }

  for (let index = startIndex; index < lines.length; index += 1) {
    const rowNumber = index + 1
    const values = parseCsvLine(lines[index])

    if (values.length < 4) {
      errors.push(`Row ${rowNumber}: expected at least 4 columns, got ${values.length}`)
      continue
    }

    if (values.length > 6) {
      errors.push(`Row ${rowNumber}: expected at most 6 columns, got ${values.length}`)
      continue
    }

    rows.push({
      recipient: values[0] ?? '',
      amount: values[1] ?? '',
      start_time: values[2] ?? '',
      end_time: values[3] ?? '',
      cliff_time: values[4] ?? '',
      cliff_amount: values[5] ?? '',
    })
  }

  return { rows, errors }
}
