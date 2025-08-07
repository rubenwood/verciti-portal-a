import { NextRequest } from 'next/server';
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  BorderStyle,
  ShadingType,
} from 'docx';


const normalize = (str: string) => str?.trim().toLowerCase();
const getMarker = (userInput: string, option: string) => {
    return normalize(userInput) === normalize(option) ? "☒" : "☐";
};

function createText(text: string, bold = false, size = 24) {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold,
        size,
        font: 'Arial',
      }),
    ],
  });
}

function createTableCell(
  text: string,
  bold = false,
  fill?: string,
  colSpan?: number
) {
  return new TableCell({
    children: [createText(text, bold)],
    columnSpan: colSpan,
    shading: fill
      ? {
          fill,
          color: 'auto',
          val: 'clear',
        }
      : undefined,
    margins: {
      top: 100,
      bottom: 100,
      left: 100,
      right: 100,
    },
  });
}
function createParagraphFromLines(
  lines: (string | { bold?: boolean; text: string })[]
): Paragraph {
  const children: TextRun[] = [];

  lines.forEach((line, idx) => {
    const breakVal = idx !== 0 ? 1 : 0;

    if (typeof line === 'string') {
      children.push(new TextRun({ 
        text: line, 
        break: breakVal, 
        size: 24,
        font: 'Arial'
      }));
    } else {
      children.push(
        new TextRun({
          text: line.text,
          bold: line.bold || false,
          break: breakVal,
          size: 24,
          font: 'Arial'
        })
      );
    }
  });

  return new Paragraph({ children });
}
function ApplicantTable(data: any): Table {
  const rows: TableRow[] = [];

  // Section header row
  rows.push(
    new TableRow({
      children: [createTableCell('1. Applicant Information', true, 'B8CCE4', 4)],
    }),
  );

  rows.push(
    new TableRow({
      children: [
        createTableCell(`Title: ${data['Title']}`),
        createTableCell(`Surname/Family Name: ${data['Surname/Family Name']}`, false, undefined, 4),
      ],
    }),
  );

  rows.push(
    new TableRow({
      children: [
        createTableCell(`First Name(s) in full: ${data['First Name in Full']}`, false, undefined, 4),
      ]
    }),
  );

  rows.push(
    new TableRow({
      children: [
        createTableCell(`Preferred name: ${data['Preferred Name']}`, false, undefined, 4),
      ],
    }),
  );

  rows.push(
    new TableRow({
      children: [ // TODO: line breaks dont create new lines
        createTableCell(`Address: ${data['Address']}\r\n\r\nPostcode: ${data['Postcode']}`, false, undefined, 4),
      ],
    }),
  );

  rows.push(
    new TableRow({
      children: [
        createTableCell(`Date of Birth: ${data['Date of Birth']}`, false, undefined, 2),
        createTableCell(`Age:`),
        createTableCell(`${data['Age']}`, false, undefined),
      ],
    }),
  );

  rows.push(
    new TableRow({
      children: [
        createTableCell(`Gender: ${data['Gender']}`, false, undefined, 4),
      ],
    }),
  );

  rows.push(
    new TableRow({
      children: [
        createTableCell(`Mobile No: ${data['Mobile No']}`, false, undefined, 4),
      ],
    }),
  );

  rows.push(
    new TableRow({
      children: [
        createTableCell(`Email address: ${data['Email']}`, false, undefined, 4),
      ],
    }),
  );

  rows.push(
    new TableRow({
      children: [
        createTableCell('National Insurance Number:'),
        createTableCell(data['National Insurance Number'],  false, undefined, 3),
      ],
    }),
  );

  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    rows,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: 'cccccc' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'cccccc' },
      left: { style: BorderStyle.SINGLE, size: 1, color: 'cccccc' },
      right: { style: BorderStyle.SINGLE, size: 1, color: 'cccccc' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'cccccc' },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'cccccc' },
    },
  })
}

function EthnicTable(data: any): Table {
  const headerRow = new TableRow({
      children: [createTableCell('2. Please indicate your ethnic group: please tick ONE box', true, 'B8CCE4', 4)],
  })
  const col1Lines = [
    { bold: true, text: 'White' },
    `${getMarker(data["Which White ethnic group do you belong to"], "English/Welsh/Scottish/Northern Irish/British")} English/Welsh/Scottish/Northern Irish/British`,
    `${getMarker(data["Which White ethnic group do you belong to"], "Irish")} Irish`,
    `${getMarker(data["Which White ethnic group do you belong to"], "Gypsy or Irish Traveler")} Gypsy or Irish Traveler`,
    `${getMarker(data["Which White ethnic group do you belong to"], "Any Other White Background")} Any Other White Background`,
    '',
    { bold: true, text: 'Mixed/Multiple ethnic groups' },
    `${getMarker(data["Which Mixed/Multiple ethnic group do you belong to?"], "White and Black Caribbean")} White and Black Caribbean`,
    `${getMarker(data["Which Mixed/Multiple ethnic group do you belong to?"], "White and Black African")} White and Black African`,
    `${getMarker(data["Which Mixed/Multiple ethnic group do you belong to?"], "White and Asian")} White and Asian`,
    `${getMarker(data["Which Mixed/Multiple ethnic group do you belong to?"], "Any other Mixed/multiple ethnic background")} Any other Mixed/multiple ethnic background`,
    '',
    { bold: true, text: '\nAsian/Asian British' },
    `${getMarker(data["Which Asian/Asian British ethnic group do you belong to?"], "Indian")} Indian`,
  ];

  const col2Lines = [
    `${getMarker(data["Which Asian/Asian British ethnic group do you belong to?"], "Pakistani")} Pakistani`,
    `${getMarker(data["Which Asian/Asian British ethnic group do you belong to?"], "Bangladeshi")} Bangladeshi`,
    `${getMarker(data["Which Asian/Asian British ethnic group do you belong to?"], "Chinese")} Chinese`,
    `${getMarker(data["Which Asian/Asian British ethnic group do you belong to?"], "Any other Asian background")} Any other Asian background`,
    '',
    { bold: true, text: '\nBlack/African/Caribbean/Black British' },
    `${getMarker(data["Which Black/African/Caribbean/Black British ethnic group do you belong to?"], "African")} African`,
    `${getMarker(data["Which Black/African/Caribbean/Black British ethnic group do you belong to?"], "Caribbean")} Caribbean`,
    `${getMarker(data["Which Black/African/Caribbean/Black British ethnic group do you belong to?"], "Any other Black/African/Caribbean background")} Any other Black/African/Caribbean background`,
    '',
    { bold: true, text: 'Other ethnic group' },
    `${getMarker(data["What other ethnic group do you belong to?"], "Arab")} Arab`,
    `${getMarker(data["What other ethnic group do you belong to?"], "Any other ethnic group")} Any other ethnic group`,
    '',
    '☐ Prefer not to say'
  ];

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      headerRow,
      new TableRow({
        children: [
          new TableCell({
            children: [createParagraphFromLines(col1Lines)],
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
            columnSpan:2,
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: "cccccc" },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: "cccccc" },
              left: { style: BorderStyle.SINGLE, size: 1, color: "cccccc" },
              right: { style: BorderStyle.NONE, size: 0, color: "ffffff" },
            },
          }),
          new TableCell({
            children: [createParagraphFromLines(col2Lines)],
            margins: { top: 100, bottom: 100, left: 100, right: 100 },columnSpan:2,
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: "cccccc" },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: "cccccc" },
              left: { style: BorderStyle.NONE, size: 0, color: "ffffff" },
              right: { style: BorderStyle.SINGLE, size: 1, color: "cccccc" },
            },
          }),
        ],
      }),
    ],
  });
}

function EmergencyTable(data: any): Table {
  const rows: TableRow[] = [];

  // Section header row
  rows.push(
    new TableRow({
      children: [createTableCell('3. Emergency Contact Details', true, 'B8CCE4', 4)],
    }),
  );

rows.push(
    new TableRow({
      children: [
        createTableCell(`Emergency Contact Name: ${data["Emergency contact name"]}`),
        createTableCell(`Relationship: ${data["Relationship"]}`),
      ]
    })
  );
  rows.push(
    new TableRow({
      children: [
        createTableCell(`Mobile telephone no: ${data["Mobile telephone no"]}`),
        createTableCell(`Home telephone no: ${data["Home telephone no"]}`),
      ]
    })
  );

  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    rows,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: 'cccccc' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'cccccc' },
      left: { style: BorderStyle.SINGLE, size: 1, color: 'cccccc' },
      right: { style: BorderStyle.SINGLE, size: 1, color: 'cccccc' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'cccccc' },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'cccccc' },
    },
  })
}

function AttainmentTable(data: any): Table {
  const rows: TableRow[] = [];

  // Section header row
  rows.push(
    new TableRow({
      children: [createTableCell('4. Prior Attainment/Highest Previous Qualifications - please tick ONE box only:', true, 'B8CCE4', 4)],
    }),
  );

  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    rows,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: 'cccccc' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'cccccc' },
      left: { style: BorderStyle.SINGLE, size: 1, color: 'cccccc' },
      right: { style: BorderStyle.SINGLE, size: 1, color: 'cccccc' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'cccccc' },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'cccccc' },
    },
  })
}

function EmptyParagraph(){
  return new Paragraph({
    children: [
      new TextRun({
        text: ``,
        bold: true,
        size: 56,
        font: 'Arial',
      }),
    ],
    spacing: { after: 400 },
  });
}

function constructWordDoc(data: any) {
  const ParagraphBreak: Paragraph = EmptyParagraph();
  const ApplicantSection: Table = ApplicantTable(data);
  const EthnicSection: Table = EthnicTable(data);
  const EmergencySection: Table = EmergencyTable(data);
  const AttainmentSection: Table = AttainmentTable(data);


  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: 'Skills Bootcamp',
                bold: true,
                size: 56, // 28pt = 56 half-points
                font: 'Arial',
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Date of application: ${data['Completion time']?.split(' ')[0] || ''}`,
                bold: true,
                size: 56,
                font: 'Arial',
              }),
            ],
            spacing: { after: 400 },
          }),
          ApplicantSection,
          EthnicSection,
          ParagraphBreak,
          EmergencySection,
          ParagraphBreak,
          AttainmentSection,
        ],
      },
    ],
  });

  return doc;
}

export async function POST(req: NextRequest) {
  const { data } = await req.json();

  if (!data) {
    return new Response(JSON.stringify({ error: 'Missing form data' }), { status: 400 });
  }

  const doc = constructWordDoc(data);
  const buffer = await Packer.toBuffer(doc);

  return new Response(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': 'attachment; filename="application.docx"',
    },
  });
}
