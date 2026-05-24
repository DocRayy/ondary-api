import PDFDocument from 'pdfkit';
import type { Response } from 'express';

export type TaskReportRow = {
  assignee: string;
  todo: string;
  status: string;
  created: number;
  completed: number;
  project: string;
  timeSpendMinutes: number;
  createdAt: string;
  groupWeek: number;
  groupDay: string;
};

export type TaskReportPdfData = {
  month: number;
  year: number;
  monthName: string;
  totalTimeSpendMinutes: number;
  totalTodos: number;
  totalProjects: number;
  totalCompleted: number;
  rows: TaskReportRow[];
};

export function normalizeReportMonth(month?: string, year?: string) {
  const now = new Date();
  const parsedMonth = Number(month);
  const parsedYear = Number(year);
  const selectedMonth =
    Number.isInteger(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12
      ? parsedMonth
      : now.getMonth() + 1;
  const selectedYear =
    Number.isInteger(parsedYear) && parsedYear > 1900
      ? parsedYear
      : now.getFullYear();
  const startDate = new Date(selectedYear, selectedMonth - 1, 1, 0, 0, 0, 0);
  const endDate = new Date(selectedYear, selectedMonth, 1, 0, 0, 0, 0);

  return {
    month: selectedMonth,
    year: selectedYear,
    monthName: startDate.toLocaleString('en-US', { month: 'long' }),
    startDate,
    endDate,
  };
}

export function formatReportDuration(totalMinutes: number) {
  const minutes = Math.max(0, Math.floor(totalMinutes || 0));
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}h ${remainingMinutes}m`;
}

export function taskGeneratehtml(data: TaskReportPdfData) {
  const rows = data.rows
    .flatMap((row, index, rows) => {
      const groupHeader =
        index === 0 ||
        rows[index - 1].groupWeek !== row.groupWeek ||
        rows[index - 1].groupDay !== row.groupDay
          ? [
              `
        <tr class="group-row">
          <td colspan="7">Week ${row.groupWeek} - ${escapeHtml(row.groupDay)}</td>
        </tr>`,
            ]
          : [];

      return [
        ...groupHeader,
        `
        <tr>
          <td>${escapeHtml(row.assignee)} &gt; ${escapeHtml(row.todo)}</td>
          <td>${escapeHtml(row.status)}</td>
          <td>${row.created}</td>
          <td>${row.completed}</td>
          <td>${escapeHtml(row.project)}</td>
          <td>${formatReportDuration(row.timeSpendMinutes)}</td>
          <td>${escapeHtml(row.createdAt)}</td>
        </tr>`,
      ];
    })
    .join('');

  return `
    <style>
      body { color: #ffffff; font-family: Arial, sans-serif; }
      .summary { display: grid; grid-template-columns: 1.4fr 0.65fr 1fr; gap: 10px; }
      .card { background: #f7f7f7; color: #000; border-radius: 8px; padding: 16px; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th { border-bottom: 1px solid #111; padding: 8px; text-align: left; }
      td { padding: 8px; font-weight: 700; }
      .group-row td { background: #eeeeee; font-size: 12px; }
    </style>
    <section class="summary">
      <div class="card">
        <b>Total Time Spend</b>
        <h1>${formatReportDuration(data.totalTimeSpendMinutes)}</h1>
        <small>Total of ${data.totalProjects} Projects</small>
      </div>
      <div>
        <div class="card"><b>${data.totalTodos}</b> Todos</div>
        <div class="card"><b>${data.totalProjects}</b> Projects</div>
        <div class="card"><b>${data.totalCompleted}</b> Completed</div>
      </div>
      <div class="card"><h2>Excellent<br />Work</h2></div>
    </section>
    <table>
      <thead>
        <tr>
          <th>Assignee &gt; Todo</th>
          <th>Status</th>
          <th>Created</th>
          <th>Completed</th>
          <th>Project</th>
          <th>Time Spend</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

export async function generatePdf(
  res: Response,
  data: TaskReportPdfData,
  filename = 'task-report.pdf',
) {
  const doc = new PDFDocument({
    size: 'A4',
    layout: 'landscape',
    margin: 20,
    bufferPages: true,
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

  doc.pipe(res);
  renderTaskReport(doc, data);
  doc.end();
}

function renderTaskReport(doc: PDFKit.PDFDocument, data: TaskReportPdfData) {
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  const margin = 20;
  const bgColor = '#ffffff';
  const cardColor = '#f7f7f7';
  const textColor = '#000000';

  doc.rect(0, 0, pageWidth, pageHeight).fill(bgColor);

  drawSummary(doc, data, margin, cardColor);
  drawTable(doc, data, margin, 145, textColor);
}

function drawSummary(
  doc: PDFKit.PDFDocument,
  data: TaskReportPdfData,
  margin: number,
  cardColor: string,
) {
  const cardY = 20;
  const cardHeight = 80;
  const firstWidth = 360;
  const secondX = margin + firstWidth + 10;
  const secondWidth = 170;
  const thirdX = secondX + secondWidth + 10;
  const thirdWidth = doc.page.width - thirdX - margin;

  doc.roundedRect(margin, cardY, firstWidth, cardHeight, 8).fill(cardColor);
  doc.roundedRect(margin + 15, cardY + 18, 45, 45, 5).fill('#d9d9d9');
  doc
    .lineWidth(2)
    .circle(margin + 37.5, cardY + 40.5, 11)
    .stroke('#000000')
    .moveTo(margin + 37.5, cardY + 40.5)
    .lineTo(margin + 37.5, cardY + 32)
    .moveTo(margin + 37.5, cardY + 40.5)
    .lineTo(margin + 46, cardY + 40.5)
    .stroke();
  doc
    .fillColor('#000000')
    .fontSize(10)
    .font('Helvetica-Bold')
    .text('Total Time Spend', margin + 75, cardY + 13)
    .fontSize(17)
    .text(
      formatReportDuration(data.totalTimeSpendMinutes),
      margin + 75,
      cardY + 40,
    )
    .fontSize(8)
    .font('Helvetica-Oblique')
    .text(`Total of ${data.totalProjects} Projects`, margin + 75, cardY + 63);

  const statRows = [
    [data.totalTodos, 'Todos'],
    [data.totalProjects, 'Projects'],
    [data.totalCompleted, 'Completed'],
  ] as const;
  statRows.forEach(([value, label], index) => {
    const y = cardY + index * 27;
    doc.roundedRect(secondX, y, secondWidth, 18, 8).fill(cardColor);
    doc
      .fillColor('#000000')
      .font('Helvetica-Bold')
      .fontSize(10)
      .text(String(value), secondX + 15, y + 4)
      .text(label, secondX + 52, y + 4);
  });

  doc.roundedRect(thirdX, cardY, thirdWidth, 54, 8).fill(cardColor);
  doc
    .fillColor('#000000')
    .font('Helvetica-Bold')
    .fontSize(17)
    .text('Excellent', thirdX + 95, cardY + 14)
    .text('Work', thirdX + 95, cardY + 35);
  doc
    .lineWidth(2)
    .path(
      `M${thirdX + 65},${cardY + 18} C${thirdX + 50},${cardY + 28} ${thirdX + 58},${cardY + 45} ${thirdX + 73},${cardY + 43} C${thirdX + 88},${cardY + 41} ${thirdX + 92},${cardY + 23} ${thirdX + 80},${cardY + 16} C${thirdX + 82},${cardY + 24} ${thirdX + 73},${cardY + 27} ${thirdX + 70},${cardY + 20} C${thirdX + 69},${cardY + 17} ${thirdX + 67},${cardY + 15} ${thirdX + 65},${cardY + 18} Z`,
    )
    .stroke('#000000');
}

function drawTable(
  doc: PDFKit.PDFDocument,
  data: TaskReportPdfData,
  margin: number,
  startY: number,
  textColor: string,
) {
  const columns = [
    { label: 'Assignee > Todo', x: margin, width: 200 },
    { label: 'Status', x: 235, width: 80 },
    { label: 'Created', x: 325, width: 55 },
    { label: 'Completed', x: 390, width: 65 },
    { label: 'Project', x: 470, width: 120 },
    { label: 'Time Spend', x: 610, width: 65 },
    { label: 'Created At', x: 695, width: 125 },
  ];
  let y = startY;

  const drawHeader = () => {
    doc.font('Helvetica-Bold').fontSize(7).fillColor(textColor);
    columns.forEach((column) => doc.text(column.label, column.x, y));
    doc
      .moveTo(margin, y + 15)
      .lineTo(doc.page.width - margin, y + 15)
      .lineWidth(0.8)
      .stroke('#111111');
    y += 28;
  };

  const ensurePageSpace = (height = 35) => {
    if (y <= doc.page.height - height) {
      return;
    }

    doc.addPage({ size: 'A4', layout: 'landscape', margin: 20 });
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#ffffff');
    y = 30;
    drawHeader();
  };

  drawHeader();

  data.rows.forEach((row, index) => {
    const previousRow = data.rows[index - 1];
    const shouldDrawGroup =
      !previousRow ||
      previousRow.groupWeek !== row.groupWeek ||
      previousRow.groupDay !== row.groupDay;

    if (shouldDrawGroup) {
      ensurePageSpace(45);
      doc
        .roundedRect(margin, y - 5, doc.page.width - margin * 2, 18, 4)
        .fill('#eeeeee')
        .fillColor('#000000')
        .font('Helvetica-Bold')
        .fontSize(8)
        .text(`Week ${row.groupWeek} - ${row.groupDay}`, margin + 8, y);
      y += 24;
    }

    ensurePageSpace();
    doc
      .font('Helvetica-Bold')
      .fontSize(7)
      .fillColor(textColor)
      .circle(margin + 7, y + 5, 7)
      .fill('#f7f7f7')
      .fillColor('#000000')
      .fontSize(4)
      .text('Photo', margin + 1.5, y + 2.5, { width: 12, align: 'center' })
      .fillColor(textColor)
      .fontSize(7)
      .text(`${row.assignee} > ${row.todo}`, margin + 20, y, { width: 170 })
      .text(row.status, columns[1].x, y, { width: columns[1].width })
      .text(String(row.created), columns[2].x, y, { width: columns[2].width })
      .text(String(row.completed), columns[3].x, y, {
        width: columns[3].width,
      })
      .text(row.project, columns[4].x, y, { width: columns[4].width })
      .text(formatReportDuration(row.timeSpendMinutes), columns[5].x, y, {
        width: columns[5].width,
      })
      .text(row.createdAt, columns[6].x, y, {
        width: columns[6].width,
      });
    y += 24;
  });

  if (data.rows.length === 0) {
    doc
      .font('Helvetica-Bold')
      .fontSize(10)
      .fillColor(textColor)
      .text('No task todos found for this month.', margin, y);
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
