import { NextRequest, NextResponse } from 'next/server';
import PdfPrinter from 'pdfmake';
import type { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import path from 'path';
import fs from 'fs';

const fonts = {
  yourFontName: {
    normal: 'https://okt.s3.us-west-2.amazonaws.com/ipaexg.ttf',
    bold: 'https://okt.s3.us-west-2.amazonaws.com/ipaexg.ttf',
    italics: 'https://okt.s3.us-west-2.amazonaws.com/ipaexg.ttf',
    bolditalics: 'https://okt.s3.us-west-2.amazonaws.com/ipaexg.ttf',
  },
}

const normalize = (str: string) => str?.trim().toLowerCase();
const getMarker = (userInput: string, option: string) => {
    return normalize(userInput) === normalize(option) ? "☒" : "☐";
};

function constructApplicantInfoSection(data: any): Content[] {
  return [
      { text: 'Skills Bootcamp', style: 'header' },
      { text: `Date of application: ${data["Completion time"]?.split(" ")[0] || ''}`, style: 'header' },

      {
        table: {
          widths: ['*'],
          body: [
            [
              {
                text: '1. Applicant Information',
                style: 'subheader',
                fillColor: '#B8CCE4',
              },
            ],
          ],
        },
        layout: 'noBorders',
        margin: [0, 10, 0, 0]
      },

      {
        table: {
          widths: ['20%', '80%'],
          body: [
            [
              { text: `Title: ${data["Title"]}`, style: 'cell' },
              { text: `Surname/Family Name: ${data["Surname/Family Name"]}`, style: 'cell' },
            ],
            [
              { text: `First Name(s) in full: ${data["First Name in Full"]}`, colSpan: 2, style: 'cell' }, {},
            ],
            [
              { text: `Preferred name: ${data["Preferred Name"]}`, colSpan: 2, style: 'cell' }, {},
            ],
            [
              {
                text: `Address: ${data["Address"]}\n\nPostcode: ${data["Postcode"]}`,
                colSpan: 2,
                style: 'cell',
              }, {},
            ],
          ],
        },
        layout: 'lightHorizontalLines',
        margin: [0, 10, 0, 0],
      },

      {
        table: {
          widths: ['30%', '10%', '10%', '50%'],
          body: [
            [
              { text: `Date of Birth (dd/mm/yyyy): ${data["Date of Birth"]}`, style: 'cell' },
              { text: 'Age:', style: 'cell' },
              { text: data["Age"], style: 'cell' },
              { text: '', style: 'cell' },
            ],
          ],
        },
        layout: 'lightHorizontalLines',
        margin: [0, 10, 0, 0],
      },

      {
        table: {
          widths: ['*'],
          body: [
            [{ text: `Gender: ${data["Gender"]}`, style: 'cell' }],
            [{ text: `Mobile No: ${data["Mobile No"]}`, style: 'cell' }],
            [{ text: `Email address: ${data["Email"]}`, style: 'cell' }],
          ],
        },
        layout: 'lightHorizontalLines',
        margin: [0, 10, 0, 0],
      },

      {
        table: {
          widths: ['25%', '75%'],
          body: [
            [
              { text: 'National Insurance Number:', style: 'cell' },
              { text: data["National Insurance Number"], style: 'cell' },
            ],
          ],
        },
        layout: 'lightHorizontalLines',
        margin: [0, 10, 0, 0],
      },
    ]
}

function constructPDFForm(data: any): TDocumentDefinitions {
   const applicantInfo = constructApplicantInfoSection(data);
  const myContent: Content[] = [
    ...constructApplicantInfoSection(data)
  ];
  return {
    content: myContent,
    styles: {
      header: {
        fontSize: 14,
        bold: true,
        margin: [0, 5, 0, 5],
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [5, 5, 5, 5],
      },
      cell: {
        fontSize: 12,
        margin: [5, 5, 5, 5],
      },
    },
    defaultStyle: {
      font: 'yourFontName',
    },
  };
}

export async function POST(req: NextRequest) {
  const { data } = await req.json();

  if (!data) {
    return new Response(JSON.stringify({ error: 'Missing form data' }), {
      status: 400,
    });
  }

  const printer = new PdfPrinter(fonts);
  const docDefinition = constructPDFForm(data);

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  const chunks: Buffer[] = [];

  return new Promise((resolve) => {
    pdfDoc.on('data', (chunk) => chunks.push(chunk));
    pdfDoc.on('end', () => {
      const result = Buffer.concat(chunks);

      resolve(
        new Response(result, {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline; filename="application.pdf"',
          },
        })
      );
    });
    pdfDoc.end();
  });
}