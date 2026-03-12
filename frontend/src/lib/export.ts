import * as XLSX from 'xlsx'

export type ExportFormat = 'excel' | 'csv' | 'pdf'

export interface ExportOptions {
  format: ExportFormat
  filename: string           // không cần extension, tự thêm
  title?: string             // tiêu đề in đầu file (Excel/PDF)
  includeHeaders?: boolean
  includeSummary?: boolean
  summaryRows?: Record<string, string | number>[]  // rows thống kê thêm vào cuối
}

// ── Helpers ────────────────────────────────────────────────────────────────

function sanitize(filename: string) {
  return filename.replace(/[^a-z0-9À-ỹ\s_-]/gi, '').replace(/\s+/g, '-').toLowerCase()
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// ── Export Excel (.xlsx) ───────────────────────────────────────────────────

export function exportExcel(
  data: Record<string, unknown>[],
  opts: ExportOptions,
) {
  const wb = XLSX.utils.book_new()

  const sheetData: unknown[][] = []

  // Tiêu đề
  if (opts.title) {
    sheetData.push([opts.title])
    sheetData.push([`Xuất ngày: ${new Date().toLocaleDateString('vi-VN')}`])
    sheetData.push([])
  }

  // Header row
  const headers = opts.includeHeaders !== false && data.length > 0
    ? Object.keys(data[0]!)
    : []
  if (headers.length) sheetData.push(headers)

  // Data rows
  for (const row of data) {
    sheetData.push(Object.values(row))
  }

  // Summary rows
  if (opts.includeSummary && opts.summaryRows?.length) {
    sheetData.push([])
    sheetData.push(['--- Thống kê ---'])
    for (const sr of opts.summaryRows) {
      sheetData.push(Object.values(sr))
    }
  }

  const ws = XLSX.utils.aoa_to_sheet(sheetData)

  // Style cột tự co giãn
  if (data.length > 0) {
    const colWidths = Object.keys(data[0]!).map((key) => ({
      wch: Math.max(
        key.length,
        ...data.slice(0, 20).map((r) => String(r[key] ?? '').length),
      ) + 2,
    }))
    ws['!cols'] = colWidths
  }

  XLSX.utils.book_append_sheet(wb, ws, 'Báo cáo')
  XLSX.writeFile(wb, `${sanitize(opts.filename)}.xlsx`)
}

// ── Export CSV ─────────────────────────────────────────────────────────────

export function exportCsv(
  data: Record<string, unknown>[],
  opts: ExportOptions,
) {
  if (!data.length) return

  const rows: string[] = []
  const headers = Object.keys(data[0]!)

  if (opts.includeHeaders !== false) {
    rows.push(headers.map((h) => `"${h}"`).join(','))
  }

  for (const row of data) {
    rows.push(
      headers.map((h) => {
        const v = row[h]
        const str = v === null || v === undefined ? '' : String(v)
        return `"${str.replace(/"/g, '""')}"`
      }).join(','),
    )
  }

  if (opts.includeSummary && opts.summaryRows?.length) {
    rows.push('')
    for (const sr of opts.summaryRows) {
      rows.push(Object.values(sr).map((v) => `"${v}"`).join(','))
    }
  }

  const bom = '\uFEFF'  // BOM UTF-8 để Excel mở đúng tiếng Việt
  const blob = new Blob([bom + rows.join('\n')], { type: 'text/csv;charset=utf-8;' })
  triggerDownload(blob, `${sanitize(opts.filename)}.csv`)
}

// ── Export PDF (browser print) ─────────────────────────────────────────────

export function exportPdf(
  data: Record<string, unknown>[],
  opts: ExportOptions,
) {
  if (!data.length) return

  const headers = Object.keys(data[0]!)
  const title = opts.title ?? opts.filename
  const date = new Date().toLocaleDateString('vi-VN')

  const thead = headers
    .map((h) => `<th style="border:1px solid #ccc;padding:6px 10px;background:#f0f0f0;font-size:13px">${h}</th>`)
    .join('')

  const tbody = data
    .map((row) =>
      `<tr>${headers.map((h) => `<td style="border:1px solid #ddd;padding:5px 10px;font-size:12px">${row[h] ?? ''}</td>`).join('')}</tr>`,
    )
    .join('')

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; padding: 24px; color: #222; }
    h2 { margin-bottom: 4px; font-size: 18px; }
    p.meta { color: #666; font-size: 12px; margin-bottom: 16px; }
    table { border-collapse: collapse; width: 100%; }
    @media print { button { display: none; } }
  </style>
</head>
<body>
  <h2>${title}</h2>
  <p class="meta">Xuất ngày: ${date} — Tổng ${data.length} bản ghi</p>
  <table>
    <thead><tr>${thead}</tr></thead>
    <tbody>${tbody}</tbody>
  </table>
  <script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); }<\/script>
</body>
</html>`

  const win = window.open('', '_blank')
  if (!win) {
    // fallback: tải file html nếu popup bị block
    const blob = new Blob([html], { type: 'text/html;charset=utf-8;' })
    triggerDownload(blob, `${sanitize(opts.filename)}.html`)
    return
  }
  win.document.write(html)
  win.document.close()
}

// ── Entry point ────────────────────────────────────────────────────────────

export function exportReport(
  data: Record<string, unknown>[],
  opts: ExportOptions,
) {
  if (!data.length) return
  switch (opts.format) {
    case 'excel': return exportExcel(data, opts)
    case 'csv':   return exportCsv(data, opts)
    case 'pdf':   return exportPdf(data, opts)
  }
}
