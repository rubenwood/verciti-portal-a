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
        createTableCell(`Address: ${data['Address']}Postcode: ${data['Postcode']}`, false, undefined, 4),
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
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
            columnSpan:2,
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

  const col1Texts = [ "No record of attainment (have not attained any qualifications", 
                      "Entry Level (Basic Entry Level, E)",
                      "Level 1 (5GCSEs D-G/3-1; 1 AS Level; GNVQ Foundation; BTEC First Certificate)",
                      "Level 2 (5 GCSEs A*-C/9-4; NVQ2; 2 or 3 AS Levels; GNVQ Intermediate; BTEC First Diploma)",
                      "Level 3 (4 AS Level; 2 A2/A Level; NVQ3; BTEC Diploma/Extended Diploma/Access to HE)"];
  const col1Lines = [
    `${getMarker(data["Prior Attainment/Highest Previous Qualifications - please tick ONE box only"], col1Texts[0])} ${col1Texts[0]}`,
    `${getMarker(data["Prior Attainment/Highest Previous Qualifications - please tick ONE box only"], col1Texts[1])} ${col1Texts[1]}`,
    `${getMarker(data["Prior Attainment/Highest Previous Qualifications - please tick ONE box only"], col1Texts[2])} ${col1Texts[2]}`,
    `${getMarker(data["Prior Attainment/Highest Previous Qualifications - please tick ONE box only"], col1Texts[3])} ${col1Texts[3]}`,
    `${getMarker(data["Prior Attainment/Highest Previous Qualifications - please tick ONE box only"], col1Texts[4])} ${col1Texts[4]}`,
  ];

  const col2Texts = [ "Level 4 (Certificate of Higher Education; HNC)",
                      "Level 5 (Foundation Degree; HND)",
                      "Level 6 (Bachelor's Degree; Graduate qualification)",
                      "Level 7 (Master's Degree; Postgraduate qualification)",
                      "Level 8 (Doctorate, PhD)",
                      "Other qualification: level not known",
                      "Not known"];
  const col2Lines = [
    `${getMarker(data["Prior Attainment/Highest Previous Qualifications - please tick ONE box only"], col2Texts[0])}, ${col2Texts[0]}`,
    `${getMarker(data["Prior Attainment/Highest Previous Qualifications - please tick ONE box only"], col2Texts[1])}, ${col2Texts[1]}`,
    `${getMarker(data["Prior Attainment/Highest Previous Qualifications - please tick ONE box only"], col2Texts[2])}, ${col2Texts[2]}`,
    `${getMarker(data["Prior Attainment/Highest Previous Qualifications - please tick ONE box only"], col2Texts[3])}, ${col2Texts[3]}`,
    `${getMarker(data["Prior Attainment/Highest Previous Qualifications - please tick ONE box only"], col2Texts[4])}, ${col2Texts[4]}`,
    `${getMarker(data["Prior Attainment/Highest Previous Qualifications - please tick ONE box only"], col2Texts[5])}, ${col2Texts[5]}`,
    `${getMarker(data["Prior Attainment/Highest Previous Qualifications - please tick ONE box only"], col2Texts[6])}, ${col2Texts[6]}`,
  ];

  const row2Col1Texts = [
    "Medicine and dentistry",
    "Subjects allied to medicine",
    "Biological and sport sciences",
    "Psychology",
    "Veterinary sciences",
    "Agriculture, food and related studies",
    "Physical sciences",
    "General and others in sciences",
    "Mathematical sciences",
    "Engineering and technology",
    "Computing",
    "Geographical and environmental studies (natural sciences)"
  ];
  const row2Col1Lines = [
    ``,
    `If you completed a level 6 qualification or higher, please select which subject this was in:`,
    ``,
    `${getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], row2Col1Texts[0])} ${row2Col1Texts[0]}`,
    `${getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], row2Col1Texts[1])} ${row2Col1Texts[1]}`,
    `${getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], row2Col1Texts[2])} ${row2Col1Texts[2]}`,
    `${getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], row2Col1Texts[3])} ${row2Col1Texts[3]}`,
    `${getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], row2Col1Texts[4])} ${row2Col1Texts[4]}`,
    `${getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], row2Col1Texts[5])} ${row2Col1Texts[5]}`,
    `${getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], row2Col1Texts[6])} ${row2Col1Texts[6]}`,
    `${getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], row2Col1Texts[7])} ${row2Col1Texts[7]}`,
    `${getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], row2Col1Texts[8])} ${row2Col1Texts[8]}`,
    `${getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], row2Col1Texts[9])} ${row2Col1Texts[9]}`,
    `${getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], row2Col1Texts[10])} ${row2Col1Texts[10]}`,
    `${getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], row2Col1Texts[11])} ${row2Col1Texts[11]}`,
];

  const row2Col2Texts = [
    "Architecture, building and planning",
    "Geographical and environmental studies (social sciences)",
    "Humanities and liberal arts (non-specific)",
    "Social sciences",
    "Law",
    "Business and management",
    "Communications and media",
    "Language and area studies",
    "Historical, philosophical and religious studies",
    "Creative arts and design",
    "Education and teaching",
    "Combined and general studies"
  ];
  const row2Col2Lines = [
    ``,
    ``,
    `${getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], row2Col2Texts[0])}, ${row2Col2Texts[0]}`,
    `${getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], row2Col2Texts[1])}, ${row2Col2Texts[1]}`,
    `${getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], row2Col2Texts[2])}, ${row2Col2Texts[2]}`,
    `${getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], row2Col2Texts[3])}, ${row2Col2Texts[3]}`,
    `${getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], row2Col2Texts[4])}, ${row2Col2Texts[4]}`,
    `${getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], row2Col2Texts[5])}, ${row2Col2Texts[5]}`,
    `${getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], row2Col2Texts[6])}, ${row2Col2Texts[6]}`,
    `${getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], row2Col2Texts[7])}, ${row2Col2Texts[7]}`,
    `${getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], row2Col2Texts[8])}, ${row2Col2Texts[8]}`,
    `${getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], row2Col2Texts[9])}, ${row2Col2Texts[9]}`,
    `${getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], row2Col2Texts[10])}, ${row2Col2Texts[10]}`,
    `${getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], row2Col2Texts[11])}, ${row2Col2Texts[11]}`
  ];

  // TODO: might need to adjust column width or font sizes
  rows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [createParagraphFromLines(col1Lines)],
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
            columnSpan:2,
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: "cccccc" },
              bottom: { style: BorderStyle.SINGLE, size: 0, color: "ffffff" },
              left: { style: BorderStyle.SINGLE, size: 1, color: "cccccc" },
              right: { style: BorderStyle.NONE, size: 0, color: "ffffff" },
            },
           }),
          new TableCell({
              children: [createParagraphFromLines(col2Lines)],
              margins: { top: 100, bottom: 100, left: 100, right: 100 },
              columnSpan:2,
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1, color: "cccccc" },
                bottom: { style: BorderStyle.NONE, size: 0, color: "ffffff" },
                left: { style: BorderStyle.NONE, size: 0, color: "ffffff" },
                right: { style: BorderStyle.SINGLE, size: 1, color: "cccccc" },
              },
            })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [createParagraphFromLines(row2Col1Lines)],
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
            columnSpan:2,
            borders: {
              top: { style: BorderStyle.NONE, size: 0, color: "ffffff" },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: "cccccc" },
              left: { style: BorderStyle.SINGLE, size: 1, color: "cccccc" },
              right: { style: BorderStyle.NONE, size: 0, color: "ffffff" },
            },
           }),
          new TableCell({
              children: [createParagraphFromLines(row2Col2Lines)],
              margins: { top: 100, bottom: 100, left: 100, right: 100 },
              columnSpan:2,
              borders: {
                top: { style: BorderStyle.NONE, size: 0, color: "ffffff" },
                bottom: { style: BorderStyle.SINGLE, size: 1, color: "cccccc" },
                left: { style: BorderStyle.NONE, size: 0, color: "ffffff" },
                right: { style: BorderStyle.SINGLE, size: 1, color: "cccccc" },
              },
            })
        ]
      }),
  );


  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    rows
  })
}

function EmploymentTable(data: any) : Table {
  const rows: TableRow[] = [];

  // Section header row
  rows.push(
    new TableRow({
      children: [
        createTableCell('5. Employment Information', true, 'B8CCE4', 4),
      ],
    }),
    new TableRow({
      children: [
        createTableCell('1. On the day prior to this course, what is your employment status? (please tick one)', false, undefined, 1),
        createTableCell('2. If employed, please state name of your employer, the postcode of your workplace, your current job role, industry/sector of current job, number of hours worked per week and your current salary (if more than 1 job, please state details for main employer):', false, undefined, 2),
        createTableCell('3. Do you currently receive any of the following?', false, undefined, 1),
      ],
    }),
  );

  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    rows
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
  const EmploymentSection: Table = EmploymentTable(data);

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
          ParagraphBreak,
          EmploymentSection,
          ParagraphBreak,
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
