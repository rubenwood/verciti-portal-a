const ApplicantInfoSection = ({ data }: any) => (
  <div className="WordSection1" style={{fontFamily: 'Arial, sans-serif'}}>
        <p style={{ fontSize: '14.5pt'}}>
            <b><i>Example Applicant form – for reference and to be used if no other exists</i></b>
        </p>
        <p style={{ fontSize: '14.5pt'}}>
            <b>Skills Bootcamp name:</b>
        </p>
        <p style={{ fontSize: '14.5pt'}}>
            <b>Date of application: DD/MM/YY</b>
        </p>

        <table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
            <thead>
            <tr style={{ backgroundColor: '#B8CCE4' }}>
                <th colSpan="12" style={{ padding: '8px', textAlign: 'left', border: '1px solid black' }}>
                1. Applicant Information
                </th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td style={{ width: '20%', border: '1px solid black', padding: '5px' }}>Title: {data.Title}</td>
                <td style={{ width: '50%', border: '1px solid black', padding: '5px' }}>Surname/Family Name: {data.surname}</td>
            </tr>
            <tr>
                <td colSpan="2" style={{ border: '1px solid black', padding: '5px' }}>First Name(s) in full:</td>
            </tr>
            <tr>
                <td colSpan="2" style={{ border: '1px solid black', padding: '5px' }}>Preferred name:</td>
            </tr>
            <tr>
                <td colSpan="2" style={{ border: '1px solid black', padding: '5px' }}>Address:
                    <br/>
                    <br/>
                    Postcode:
                </td>
            </tr>
            </tbody>
        </table>
        <table  style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
            <tbody>
                <tr>
                    <td style={{ width:'30%', border: '1px solid black', padding: '5px' }}>Date of Birth (dd/mm/yyyy):</td>
                    <td style={{ width:'10%', border: '1px solid black', padding: '5px' }}>Age:</td>
                    <td style={{ width:'10%', border: '1px solid black', padding: '5px' }}></td>
                    <td style={{ width:'50%', border: '1px solid black', padding: '5px' }}></td>
                </tr>
            </tbody>
        </table>
        <table  style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
            <tbody>
                <tr>
                    <td style={{ width:'100%', border: '1px solid black', padding: '5px' }}>Gender:</td>
                </tr>
                <tr>
                    <td style={{ width:'100%', border: '1px solid black', padding: '5px' }}>Mobile No:</td>
                </tr>
                <tr>
                    <td style={{ width:'100%', border: '1px solid black', padding: '5px' }}>Email address:</td>
                </tr>
            </tbody>
        </table>
        <table>
            <tbody>
                <tr>
                    <td style={{ width:'25%', border: '1px solid black', padding: '5px' }}>National Insurance Number:</td>
                    <td style={{ width:'30%', border: '1px solid black', padding: '5px' }}></td>
                </tr>
            </tbody>
        </table>
    </div>
);

const ApplicantEthnicSection = ({ data }: any) => (
  <div className="WordSection2" style={{fontFamily: 'Arial, sans-serif'}}>
        <table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
            <thead>
            <tr style={{ backgroundColor: '#B8CCE4' }}>
                <th colSpan="12" style={{ padding: '8px', textAlign: 'left', border: '1px solid black' }}>
                2. Please indicate your ethnic group: please tick ONE box
                </th>
            </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                    <b>White</b><br/>
☐	English/Welsh/Scottish/Northern Irish/British<br/>
☐	Irish<br/>
☐	Gypsy or Irish Traveller<br/>
☐	Any Other White Background<br/>
Mixed/Multiple ethnic groups
☐	White and Black Caribbean
☐	White and Black African
☐	White and Asian
☐	Any other Mixed/multiple ethnic background
Asian/Asian British
☐	Indian</td>
                    <td>☐	Pakistani
☐	Bangladeshi
☐	Chinese
☐	Any other Asian background
Black/African/Caribbean/Black British
☐	African
☐	Caribbean
☐	Any other Black/African/Caribbean background
Other ethnic group
☐	Arab
☐	Any other ethnic group
 
☐	Prefer not to say
</td>
                </tr>
            </tbody>
        </table>
    </div>
);

export default function PrintableApplicantFormTool(){
    return (
        <>
            <h1 className="header">Printable Applicant Form Processor</h1>
            <p>This tool allows you to upload a spreadsheet that will produce a printable applicant form for each entry</p>
            <ApplicantInfoSection data={{}}/>
            <ApplicantEthnicSection />
        </>
    )
}