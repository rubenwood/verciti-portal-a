import { NextRequest } from 'next/server';
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  ExternalHyperlink,
  WidthType,
  BorderStyle,
  ShadingType,
} from 'docx';

const formatUKDate = (dateString: string) => {
  const [datePart] = dateString.split(" ");
  const [day, month, year] = datePart.split("/").map(Number);

  return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
};
const normalize = (str: string) => str?.trim().toLowerCase();
const getMarker = (userInput: string, options: string | string[]) => {
    const optionArray = Array.isArray(options) ? options : [options];
    const isMatch = optionArray.some(option => normalize(userInput) === normalize(option));

    return isMatch ? "☒" : "☐";
};
const getMultiMarker = (userInput: string, option: string) => {
    if (!userInput) return "☐";

    let selections: string[] = [];

    // Try to parse as JSON array
    try {
        const parsed = JSON.parse(userInput);
        if (Array.isArray(parsed)) {
            selections = parsed.map(s => String(s).trim());
        }
    } catch {
        // If JSON.parse fails, assume semicolon-delimited string
        selections = userInput.split(";").map(s => s.trim()).filter(Boolean);
    }

    return selections.includes(option) ? "☒" : "☐";
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
  const linkRegex = /<Link href=['"]([^'"]+)['"]>(.*?)<\/Link>/gi;
  const parts: Paragraph[] = [];

  // Split by lines first
  text.split("\n").forEach(line => {
    const segments: (TextRun | ExternalHyperlink)[] = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(line)) !== null) {
      const before = line.substring(lastIndex, match.index);
      if (before) {
        segments.push(new TextRun({ text: before, bold, font:'Arial', size:24 }));
      }

      segments.push(
        new ExternalHyperlink({
          link: match[1],
          children: [
            new TextRun({
              text: match[2],
              style: "Hyperlink",
              font:'Arial',
              size:24 
            }),
          ],
        })
      );

      lastIndex = match.index + match[0].length;
    }

    // Remaining text after last link
    const after = line.substring(lastIndex);
    if (after) {
      segments.push(new TextRun({ text: after, bold, font:'Arial', size:24 }));
    }

    parts.push(new Paragraph({ children: segments }));
  });

  return new TableCell({
    children: parts,
    columnSpan: colSpan,
    shading: fill
      ? {
          fill,
          color: "auto",
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
        createTableCell(`Address: ${data['Address']} Postcode: ${data['Postcode']}`, false, undefined, 4),
      ],
    }),
  );

  rows.push(
    new TableRow({
      children: [
        createTableCell(`Date of Birth: ${formatUKDate(data['Date of Birth'])}`, false, undefined, 2),
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
        createTableCell(`Email address: ${data['Email Address']}`, false, undefined, 4),
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
      top: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
      left: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
      right: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
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

  const ethnicRow = new TableRow({
    children: [
      new TableCell({
        children: [createParagraphFromLines(col1Lines)],
        margins: { top: 100, bottom: 100, left: 100, right: 100 },
        columnSpan:2,
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          right: { style: BorderStyle.NONE, size: 0, color: "ffffff" },
        },
      }),
      new TableCell({
        children: [createParagraphFromLines(col2Lines)],
        margins: { top: 100, bottom: 100, left: 100, right: 100 },
        columnSpan:2,
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          left: { style: BorderStyle.NONE, size: 0, color: "ffffff" },
          right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        },
      }),
    ],
  });

  const criminalLines = [
    `Do you have a criminal conviction (excluding minor motoring offences)?`,
    '',
    `${getMarker(data["Do you have a criminal conviction (excluding minor motoring offences)?"], "Yes")} Yes ${getMarker(data["Do you have a criminal conviction (excluding minor motoring offences)?"], "No")} No`
  ];

  const carerLines = [
    `Are you currently caring for children or other adults?`,
    '',
    `${getMarker(data["Are you currently caring for children or other adults?"], "Yes")} Yes ${getMarker(data["Are you currently caring for children or other adults?"], "No")} No`
  ];

  const criminalRow = new TableRow({
    children: [
      new TableCell({
        children: [createParagraphFromLines(criminalLines)],
        margins: { top: 100, bottom: 100, left: 100, right: 100 },
        columnSpan:4,
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          bottom: { style: BorderStyle.NONE, size: 0, color: "000000" },
          left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        },
      }),   
    ],
  });
  const carerRow = new TableRow({
    children: [
      new TableCell({
        children: [createParagraphFromLines(carerLines)],
        margins: { top: 100, bottom: 100, left: 100, right: 100 },
        columnSpan:4,
        borders: {
          top: { style: BorderStyle.NONE, size: 0, color: "000000" },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        },
      }),   
    ],
  });  

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      headerRow,
      ethnicRow,
      criminalRow,
      carerRow,
    ]
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
      top: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
      left: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
      right: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
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
    `${getMarker(data["Prior Attainment/Highest Previous Qualifications - please tick ONE box only"], col2Texts[0])} ${col2Texts[0]}`,
    `${getMarker(data["Prior Attainment/Highest Previous Qualifications - please tick ONE box only"], col2Texts[1])} ${col2Texts[1]}`,
    `${getMarker(data["Prior Attainment/Highest Previous Qualifications - please tick ONE box only"], col2Texts[2])} ${col2Texts[2]}`,
    `${getMarker(data["Prior Attainment/Highest Previous Qualifications - please tick ONE box only"], col2Texts[3])} ${col2Texts[3]}`,
    `${getMarker(data["Prior Attainment/Highest Previous Qualifications - please tick ONE box only"], col2Texts[4])} ${col2Texts[4]}`,
    `${getMarker(data["Prior Attainment/Highest Previous Qualifications - please tick ONE box only"], col2Texts[5])} ${col2Texts[5]}`,
    `${getMarker(data["Prior Attainment/Highest Previous Qualifications - please tick ONE box only"], col2Texts[6])} ${col2Texts[6]}`,
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
    `${getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], row2Col2Texts[0])} ${row2Col2Texts[0]}`,
    `${getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], row2Col2Texts[1])} ${row2Col2Texts[1]}`,
    `${getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], row2Col2Texts[2])} ${row2Col2Texts[2]}`,
    `${getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], row2Col2Texts[3])} ${row2Col2Texts[3]}`,
    `${getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], row2Col2Texts[4])} ${row2Col2Texts[4]}`,
    `${getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], row2Col2Texts[5])} ${row2Col2Texts[5]}`,
    `${getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], row2Col2Texts[6])} ${row2Col2Texts[6]}`,
    `${getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], row2Col2Texts[7])} ${row2Col2Texts[7]}`,
    `${getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], row2Col2Texts[8])} ${row2Col2Texts[8]}`,
    `${getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], row2Col2Texts[9])} ${row2Col2Texts[9]}`,
    `${getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], row2Col2Texts[10])} ${row2Col2Texts[10]}`,
    `${getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], row2Col2Texts[11])} ${row2Col2Texts[11]}`
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

  const col1Texts = [
    "in full-time employment",
    "in part-time employment",
    "Employed – zero-hour contract",
    "Self-employed",
    "Unemployed less than 6 months",
    "Unemployed for 6-11 months",
    "Unemployed for 12-23 months",
    "Unemployed for 24-35 months",
    "Unemployed for 36 months or over",
    "In full-time education or training",
    "Not working – long term sickness",
    "Not working – caring responsibilities",
    "Prisoner",
    "Retired"
  ];
  const col1Lines = [
    `${getMarker(data["On the day prior to this course, what is your employment status? (please select one)"], col1Texts[0])} ${col1Texts[0]}`,
    `${getMarker(data["On the day prior to this course, what is your employment status? (please select one)"], col1Texts[1])} ${col1Texts[1]}`,
    `${getMarker(data["On the day prior to this course, what is your employment status? (please select one)"], [col1Texts[2], "Employed - zero-hour contract"])} ${col1Texts[2]}`,
    `${getMarker(data["On the day prior to this course, what is your employment status? (please select one)"], col1Texts[3])} ${col1Texts[3]}`,
    `${getMarker(data["On the day prior to this course, what is your employment status? (please select one)"], col1Texts[4])} ${col1Texts[4]}`,
    `${getMarker(data["On the day prior to this course, what is your employment status? (please select one)"], col1Texts[5])} ${col1Texts[5]}`,
    `${getMarker(data["On the day prior to this course, what is your employment status? (please select one)"], col1Texts[6])} ${col1Texts[6]}`,
    `${getMarker(data["On the day prior to this course, what is your employment status? (please select one)"], col1Texts[7])} ${col1Texts[7]}`,
    `${getMarker(data["On the day prior to this course, what is your employment status? (please select one)"], col1Texts[8])} ${col1Texts[8]}`,
    `${getMarker(data["On the day prior to this course, what is your employment status? (please select one)"], col1Texts[9])} ${col1Texts[9]}`,
    `${getMarker(data["On the day prior to this course, what is your employment status? (please select one)"], [col1Texts[10], "Not working - long term sickness"])} ${col1Texts[10]}`,
    `${getMarker(data["On the day prior to this course, what is your employment status? (please select one)"], [col1Texts[11], "Not working - caring responsibilities"])} ${col1Texts[11]}`,
    `${getMarker(data["On the day prior to this course, what is your employment status? (please select one)"], col1Texts[12])} ${col1Texts[12]}`,
    `${getMarker(data["On the day prior to this course, what is your employment status? (please select one)"], col1Texts[13])} ${col1Texts[13]}`
  ];

  const col3Texts = [
    "In receipt of JSA",
    "In receipt of ESA (Part of WRAG group)",
    "In receipt of Universal Credit",
    "In receipt of another State Benefit",
    "None"
  ];
  const col3Lines = [
    `${getMarker(data["Do you currently receive any of the following?"], col3Texts[0])} ${col3Texts[0]}`,
    `${getMarker(data["Do you currently receive any of the following?"], col3Texts[1])} ${col3Texts[1]}`,
    `${getMarker(data["Do you currently receive any of the following?"], col3Texts[2])} ${col3Texts[2]}`,
    `${getMarker(data["Do you currently receive any of the following?"], col3Texts[3])} ${col3Texts[3]}`,
    `${getMarker(data["Do you currently receive any of the following?"], col3Texts[4])} ${col3Texts[4]}`
  ];



  const sec4Lines = [
    `4. If employed, are you attending this bootcamp via your current employer (has applicant been sent on the bootcamp through their current employment)?`,
    '',
    `${getMarker(data["If employed, are you attending this bootcamp via your current employer (has applicant been sent on the bootcamp through their current employment)?"], "Yes")} Yes`,
    `${getMarker(data["If employed, are you attending this bootcamp via your current employer (has applicant been sent on the bootcamp through their current employment)?"], "No")} No`,
    `${getMarker(data["If employed, are you attending this bootcamp via your current employer (has applicant been sent on the bootcamp through their current employment)?"], "N/A - not in paid employment")} N/A – not in paid employment`
  ]
  const sec4Row = new TableRow({
    children: [
      new TableCell({
        children: [createParagraphFromLines(sec4Lines)],
        margins: { top: 100, bottom: 100, left: 100, right: 100 },
        columnSpan:4,
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        },
      }),   
    ],
  });

  const sec5Lines = [
    `5. Do you plan to work alongside the bootcamp?`,
    '',
    `${getMarker(data["Do you plan to work alongside the bootcamp?"], "Yes (Full-time employment)")} - Yes (Full-time employment)	${getMarker(data["Do you plan to work alongside the bootcamp?"], "Yes (Self-employed)")} - Yes (Self-employed)`,
    `${getMarker(data["Do you plan to work alongside the bootcamp?"], "Yes (Part time employed)")} - Yes (Part time employed)    ${getMarker(data["Do you plan to work alongside the bootcamp?"], "No")} - No`
  ]
  const sec5Row = new TableRow({
    children: [
      new TableCell({
        children: [createParagraphFromLines(sec5Lines)],
        margins: { top: 100, bottom: 100, left: 100, right: 100 },
        columnSpan:4,
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        },
      }),   
    ],
  });

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
  new TableRow({
      children: [
        createTableCell(col1Lines.join('\n'), false, undefined, 1),
        createTableCell(`Name of employer: ${data["Name of Employer"]}\n\nWorkplace postcode: ${data["Workplace postcode"].toUpperCase()}\n\nCurrent job title: ${data["Current Job Title"]}\n\nIndustry / sector of current occupation: ${data["Industry/sector of current occupation"]}\n\nHours worked per week: ${data["Hours worked per week"]}\n\nCurrent salary (please specify if hourly rate, weekly, monthly or yearly): ${data["Current Salary (please specify if hourly rate, weekly, monthly or yearly)"]}\n`, false, undefined, 2),
        createTableCell(col3Lines.join('\n'), false, undefined, 1),
      ],
    }),
    sec4Row,
    sec5Row
  );



  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    rows
  })
}

function DisabilityTable(data: any) : Table {
  const rows: TableRow[] = [];

  rows.push(
      new TableRow({
        children: [
          createTableCell('6.	Disability, Learning Difficulty and or Long Term Health Condition – please tick all that apply, if no option is indicated the starred * option will be selected', true, 'B8CCE4', 4),
        ],
      }),
      new TableRow({
        children: [
            createTableCell(`Do you consider that you have a learning difficulty, disability or long term health condition?\nYes ${getMarker(data["Do you consider that you have a learning difficulty, disability or long term health condition?"], "Yes")}	*No ${getMarker(data["Do you consider that you have a learning difficulty, disability or long term health condition?"], "No")}	Prefer not to say ${getMarker(data["Do you consider that you have a learning difficulty, disability or long term health condition?"], ["Prefer Not to Say", "Prefer not to say"])}`, false, undefined, 3)
        ]
    }),
    new TableRow({
      children: [
        createTableCell(`${getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Allergy")} Allergy\n${getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Asperger’s Syndrome")} Asperger’s Syndrome\n${getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Asthma")} Asthma\n${getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Autism Spectrum Condition")} Autism Spectrum Condition\n${getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Cystic Fibrosis")} Cystic Fibrosis\n${getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Diabetes")} Diabetes\n${getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Disability Affecting Mobility")} Disability Affecting Mobility\n${getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Dyscalculia")} Dyscalculia\n${getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Dyslexia")} Dyslexia\n`),
        createTableCell(`${getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Epilepsy")} Epilepsy\n${getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Hearing Impairment")} Hearing Impairment\n${getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Diagnosed mental health condition")} Diagnosed mental health condition\n${getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Moderate Learning Difficulty")} Moderate Learning Difficulty\n${getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Physical Disability")} Physical Disability\n${getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Other Specific Learning Difficulty e.g. Dyspraxia")} Other Specific Learning Difficulty e.g. Dyspraxia\n${getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Profound/Complex Disabilities")} Profound/Complex Disabilities\n${getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Severe Learning Difficulty")} Severe Learning Difficulty\n`),
        createTableCell(`${getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Social, Emotional & Behavioural Difficulties")} Social, Emotional & Behavioural Difficulties\n${getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Speech, Language and Communication needs")} Speech, Language and Communication needs\n${getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Temporary Disability after Illness or accident")} Temporary Disability after Illness or accident\n${getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Visual Impairment-excluding glasses/contact lenses")} Visual Impairment-excluding glasses/contact lenses\n${getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Prefer not to say")} Prefer not to say\n${getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Are you a wheelchair user?")} Are you a wheelchair user?\n`)
      ]
    }),
    new TableRow({
      children:[
        createTableCell(`If you have selected more than one of the above, please state which disability, learning difficulty and/or health condition impacts most on your learning\n\n${data["If you have selected more than one of the above, please state which disability, learning difficulty and/or health condition impacts most on your learning"]}`, false, undefined, 3)
      ]
    }),
    new TableRow({
      children:[
        createTableCell(`If you have a support need and would benefit from a confidential interview, please tick this box ${normalize(data["Do you a have support need and would benefit from a confidential interview"]) == "yes" ? "☒" : "☐"}`, false, undefined, 3)
      ]
    })
  )

  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    rows
  })
}
function MarketingTable(data: any) : Table {
  const rows: TableRow[] = [];

  rows.push(
    new TableRow({
      children: [
        createTableCell('7. Contact and Marketing Information', true, 'B8CCE4', 4),
      ],
    }),
    new TableRow({
      children:[ 
        createTableCell(`How did you hear about us?\n\n${getMarker(data["How did you hear about us?"], "Current Employer")} Current Employer\n${getMarker(data["How did you hear about us?"], "Job Centre / Work Coach / DWP")} Job Centre / Work Coach / DWP\n${getMarker(data["How did you hear about us?"], "Social Media")} Social Media\n${getMarker(data["How did you hear about us?"], "Friends / Family")} Friends / Family\n${getMarker(data["How did you hear about us?"], "FE college / training provider")} FE college / training provider\n${getMarker(data["How did you hear about us?"], "The National Careers Servic")} The National Careers Service\n${getMarker(data["How did you hear about us?"], "Gov.uk website")} Gov.uk website\n${getMarker(data["How did you hear about us?"], "Other (e.g. search engine, local media press)")} Other (e.g. search engine, local media press)\n`)
      ]
    })
  )

  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    rows
  })
}
function DeclarationTable(data: any) : Table {
   const rows: TableRow[] = [];

   rows.push(
    new TableRow({
      children: [
        createTableCell('8. Learner Declaration and Commitment ', true, 'B8CCE4', 4),
      ],
    })
  );

  rows.push(
    new TableRow({
      children: [
        createTableCell(`I agree that initial assessment and information advice and guidance concerning the course has been provided to me, this included information about the course, its entry requirements, the implications of the choice of course, its suitability and the support which is available to me. I agree that the information given on this agreement is true, correct and completed to the best of my knowledge and I understand that Verciti has the right to cancel my enrolment if it is found that I have provided false or inaccurate information. I agree that this information can be used to process my data for any purposes connected with my studies or my health and safety whilst on the premises. This also includes any other contractual requirements and, in particular to the disclosure of all the data on this form or otherwise collected about me to the DfE for the purposes noted in the Privacy Notice (add link to most current privacy notice and privacy Q&A here). I also agree with the below points relating to my chosen programme: \n\n- Take appropriate responsibility for my own learning, development and progression\n- Attend and undertake training required to achieve the Skills Bootcamp identified in Programme Details in the ILP\n- Promptly inform the Employer and/or Verciti if any matters or issues arise, or might arise, that will, or may, affect my learning, development and progression\n- All times behave in a safe and responsible manner and in accordance with the statutory requirements of health and safety law relating to my responsibilities from time to time\n- Comply with the policies, regulations and procedures of my Employer and/or Verciti, notified to me from time to time;\n\nIf you wish to raise a complaint about how we have handled your personal data email to Verciti or any other issues, please email info@verciti.com with full details of your issue. If you are not satisfied how your complaint has been dealt with, please be aware of Authority’s Whistleblowing and Complaints policies and processes. Whistleblowing involves entering a 'whistleblowing' webform on the 'Contact the Department for Education' page, which can be found below: <Link href='https://form.education.gov.uk/service/Contact_the_Department_for_Education'>Contact the Department for Education - DFE Online Forms</Link>. Whistleblowing entries for Skills Bootcamps must be clearly marked as 'Skills Bootcamps' and will submitted via the DfE's whistleblowing submission process and will be escalated to the relevant policy team.\n\nYour information may also be shared with other third parties for the above purposes, but only where the law allows it and the sharing is in compliance with data protection legislation. You can agree to be contacted for other purposes by ticking any of the following boxes:\n\n
        ${getMarker(data["Your information may also be shared with other third parties for the above purposes, but only where the law allows it and the sharing is in compliance with data protection legislation. You can agr..."], "About courses or learning opportunities")} About courses or learning opportunities\n
        ${getMarker(data["Your information may also be shared with other third parties for the above purposes, but only where the law allows it and the sharing is in compliance with data protection legislation. You can agr..."], "For research and evaluation purposes")} For research and evaluation purposes\n
        ${getMarker(data["Your information may also be shared with other third parties for the above purposes, but only where the law allows it and the sharing is in compliance with data protection legislation. You can agr..."], "By post")} By post\n
        ${getMarker(data["Your information may also be shared with other third parties for the above purposes, but only where the law allows it and the sharing is in compliance with data protection legislation. You can agr..."], "By phone")} By phone\n
        ${getMarker(data["Your information may also be shared with other third parties for the above purposes, but only where the law allows it and the sharing is in compliance with data protection legislation. You can agr..."], "By email")} By email\n
        \n\nI agree to visual images being used for marketing purposes\n
        ${getMarker(data["I agree to visual images being used for marketing purposes"], "Yes")} Yes\n
        ${getMarker(data["I agree to visual images being used for marketing purposes"], "No")} No \n\n`)
      ]
    })
  );

  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    rows
  })
}

function SignatureTable(data:any ): Table {
  const rows: TableRow[] = [];
  rows.push(
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.DXA },
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
            children: [createText('Learner Name')]
          }),
          new TableCell({
            width: { size: 2000, type: WidthType.DXA },
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
            children: [createText('')]
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.DXA },
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
            children: [createText('Signature')]
          }),
          new TableCell({
            width: { size: 2000, type: WidthType.DXA },
          margins: { top: 100, bottom: 100, left: 100, right: 100 },
            children: [createText('')]
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.DXA },
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
            children: [createText('Date')]
          }),
          new TableCell({
            width: { size: 2000, type: WidthType.DXA },
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
            children: [createText('')]
          })
        ]
      }),
    );
  return new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      columnWidths: [200, 1800],
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
  const DisabilitySection: Table = DisabilityTable(data);
  const MarketingSection: Table = MarketingTable(data);
  const DeclarationSection: Table = DeclarationTable(data);
  const SignatureSection: Table = SignatureTable(data);

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
                text: `Date of application: ${formatUKDate(data['Completion time']?.split(' ')[0]) || ''}`,
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
          DisabilitySection,
          ParagraphBreak,
          MarketingSection,
          ParagraphBreak,
          DeclarationSection,
          ParagraphBreak,
          SignatureSection
        ],
      },
    ],
  });

  return doc;
}

export async function POST(req: NextRequest) {
  const { data } = await req.json();

  if (!data || data['Completion time'] === "") {
    return new Response(JSON.stringify({ error: 'Missing form data' }), { status: 400 });
  }

  const doc = constructWordDoc(data);
  const buffer = await Packer.toBuffer(doc);
  const uint8Array = new Uint8Array(buffer);

  return new Response(uint8Array, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': 'attachment; filename="application.docx"',
    },
  });
}
