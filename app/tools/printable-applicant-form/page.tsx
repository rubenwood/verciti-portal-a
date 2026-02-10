'use client';
import { useRef, useState, useEffect, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Link from "next/link";
import Papa from 'papaparse';   

import { User } from '@supabase/supabase-js'
import { checkUser } from "../../db/general/get-user"

import Login from '../../login/login-component'

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

const ApplicantInfoSection = ({ data, variant }: any) => (
  <div className="WordSection1" style={{fontFamily: 'Arial, sans-serif'}}>
        <p style={{ fontSize:'14pt' }}>
            <b>{variant.header}</b>
        </p>
        <p style={{ fontSize:'14pt' }}>
            <b>Date of application: {formatUKDate(data["Completion time"].split(" ")[0])}</b>
        </p>

        <table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
            <thead>
            <tr style={{ backgroundColor: '#B8CCE4' }}>
                <th colSpan={12} style={{ fontSize:'14pt', padding: '8px', textAlign: 'left', border: '1px solid black' }}>
                1. Applicant Information
                </th>
            </tr>
            </thead>
            <tbody style={{fontSize: '12pt'}}>
            <tr>
                <td style={{ width: '20%', border: '1px solid black', padding: '5px', paddingBottom:'10px' }}>Title: {data["Title"]}</td>
                <td style={{ width: '50%', border: '1px solid black', padding: '5px', paddingBottom:'10px' }}>Surname/Family Name: {data["Surname/Family Name"]}</td>
            </tr>
            <tr>
                <td colSpan={2} style={{ border: '1px solid black', padding: '5px', paddingBottom:'10px' }}>First Name(s) in full: {data["First Name in Full"]}</td>
            </tr>
            <tr>
                <td colSpan={2} style={{ border: '1px solid black', padding: '5px', paddingBottom:'10px' }}>Preferred name: {data["Preferred Name"]}</td>
            </tr>
            <tr>
                <td colSpan={2} style={{ border: '1px solid black', padding: '5px', paddingBottom:'10px' }}>Address: {data["Address"]}
                    <br/>
                    <br/>
                    Postcode:{data["Postcode"].toUpperCase()}
                </td>
            </tr>
            </tbody>
        </table>
        <table  style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
            <tbody style={{fontSize: '12pt'}}>
                <tr>
                    <td style={{ width:'30%', border: '1px solid black', padding: '5px', paddingBottom:'10px' }}>Date of Birth (dd/mm/yyyy): {formatUKDate(data["Date of Birth"])}</td>
                    <td style={{ width:'10%', border: '1px solid black', padding: '5px', paddingBottom:'10px' }}>Age:</td>
                    <td style={{ width:'10%', border: '1px solid black', padding: '5px', paddingBottom:'10px' }}>{data["Age"]}</td>
                    <td style={{ width:'50%', border: '1px solid black', padding: '5px', paddingBottom:'10px' }}></td>
                </tr>
            </tbody>
        </table>
        <table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
            <tbody style={{fontSize: '12pt'}}>
                <tr>
                    <td style={{ width:'100%', border: '1px solid black', padding: '5px', paddingBottom:'10px' }}>Gender: {data["Gender"]}</td>
                </tr>
                <tr>
                    <td style={{ width:'100%', border: '1px solid black', padding: '5px', paddingBottom:'10px' }}>Mobile No: {data["Mobile No"]}</td>
                </tr>
                <tr>
                    <td style={{ width:'100%', border: '1px solid black', padding: '5px', paddingBottom:'10px' }}>Email address: {data["Email Address"]}</td>
                </tr>
            </tbody>
        </table>
        <table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
            <tbody style={{fontSize: '12pt'}}>
                <tr style={{ width:'100%'}}>
                    <td style={{ width:'25%', border: '1px solid black', padding: '5px', paddingBottom:'10px' }}>National Insurance Number:</td>
                    <td style={{ width:'35%', border: '1px solid black', padding: '5px', paddingBottom:'10px'}}> {data["National Insurance Number"]}</td>
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
                <th colSpan={12} style={{ fontSize:'14pt', padding: '8px', textAlign: 'left', border: '1px solid black' }}>
                2. Please indicate your ethnic group: please tick ONE box
                </th>
            </tr>
            </thead>
            <tbody style={{fontSize: '12pt'}}>
                <tr>
                    <td style={{ padding: '5px', paddingBottom:'10px' }}>
                        <b>White</b><br/>
                        {getMarker(data["Which White ethnic group do you belong to"], "English/Welsh/Scottish/Northern Irish/British")} English/Welsh/Scottish/Northern Irish/British<br/>
                        {getMarker(data["Which White ethnic group do you belong to"], "Irish")} Irish<br/>
                        {getMarker(data["Which White ethnic group do you belong to"], "Gypsy or Irish Traveler")} Gypsy or Irish Traveler<br/>
                        {getMarker(data["Which White ethnic group do you belong to"], "Any Other White Background")} Any Other White Background<br/>
                        <b>Mixed/Multiple ethnic groups</b><br/>
                        {getMarker(data["Which Mixed/Multiple ethnic group do you belong to?"], "White and Black Caribbean")} White and Black Caribbean<br/>
                        {getMarker(data["Which Mixed/Multiple ethnic group do you belong to?"], "White and Black African")} White and Black African<br/>
                        {getMarker(data["Which Mixed/Multiple ethnic group do you belong to?"], "White and Asian")} White and Asian<br/>
                        {getMarker(data["Which Mixed/Multiple ethnic group do you belong to?"], "Any other Mixed/multiple ethnic background")} Any other Mixed/multiple ethnic background<br/>
                        <b>Asian/Asian British</b><br/>
                        {getMarker(data["Which Asian/Asian British ethnic group do you belong to?"], "Indian")} Indian
                    </td>
                    <td style={{ padding: '5px', paddingBottom:'10px' }}>
                        {getMarker(data["Which Asian/Asian British ethnic group do you belong to?"], "Pakistani")} Pakistani<br/>
                        {getMarker(data["Which Asian/Asian British ethnic group do you belong to?"], "Bangladeshi")} Bangladeshi<br/>
                        {getMarker(data["Which Asian/Asian British ethnic group do you belong to?"], "Chinese")} Chinese<br/>
                        {getMarker(data["Which Asian/Asian British ethnic group do you belong to?"], "Any other Asian background")} Any other Asian background<br/>
                        <b>Black/African/Caribbean/Black British</b><br/>
                        {getMarker(data["Which Black/African/Caribbean/Black British ethnic group do you belong to?"], "African")} African<br/>
                        {getMarker(data["Which Black/African/Caribbean/Black British ethnic group do you belong to?"], "Caribbean")} Caribbean<br/>
                        {getMarker(data["Which Black/African/Caribbean/Black British ethnic group do you belong to?"], "Any other Black/African/Caribbean background")} Any other Black/African/Caribbean background<br/>
                        <b>Other ethnic group</b><br/>
                        {getMarker(data["What other ethnic group do you belong to?"], "Arab")} Arab<br/>
                        {getMarker(data["What other ethnic group do you belong to?"], "Any other ethnic group")} Any other ethnic group<br/>
                        <br/>
                        ☐	Prefer not to say<br/><br/>  {/* TODO: sort this out */}
                    </td>
                </tr>
                <tr style={{ border: '1px solid black' }}></tr>
                <tr>
                    <td style={{ padding: '5px', paddingBottom:'10px' }}>
                        Do you have a criminal conviction (excluding minor motoring offences)?
                    </td>
                    <td style={{ padding: '5px', paddingBottom:'10px' }}>
                        <br/>
                        {getMarker(data["Do you have a criminal conviction (excluding minor motoring offences)?"], "Yes")} Yes<br/><br/>
                        {getMarker(data["Do you have a criminal conviction (excluding minor motoring offences)?"], "No")} No
                    </td>
                </tr>
                {/* <br/> */}
                <tr style={{ height: 10 }}></tr>
                <tr>
                    <td style={{ padding: '5px', paddingBottom:'10px' }}>
                        Are you currently caring for children or other adults? - please tick ONE box
                    </td>
                    <td style={{ padding: '5px', paddingBottom:'10px' }}>
                        <br/>
                        {getMarker(data["Are you currently caring for children or other adults?"], "Yes")} Yes<br/><br/>                        
                        {getMarker(data["Are you currently caring for children or other adults?"], "No")} No<br/><br/>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
);
const ApplicantEmergencyContactSection = ({ data }: any) => (
  <div className="WordSection2" style={{fontFamily: 'Arial, sans-serif'}}>
        <table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
            <thead>
            <tr style={{ backgroundColor: '#B8CCE4' }}>
                <th colSpan={12} style={{ fontSize:'14pt', padding: '8px', textAlign: 'left', border: '1px solid black' }}>
                3. Emergency Contact Details
                </th>
            </tr>
            </thead>
            <tbody style={{fontSize: '12pt'}}>
                <tr>
                    <td style={{ border: '1px solid black', padding: '5px', paddingBottom:'10px' }}>
                        <p>Emergency Contact Name: {data["Emergency contact name"]}</p>
                    </td>
                    <td style={{ border: '1px solid black', padding: '5px', paddingBottom:'10px' }}>
                        <p>Relationship: {data["Relationship"]}</p>
                    </td>
                </tr>
                <tr>
                    <td style={{ border: '1px solid black', padding: '5px', paddingBottom:'10px' }}>
                        <p>Mobile telephone no: {data["Mobile telephone no"]}</p>
                    </td>
                    <td style={{ border: '1px solid black', padding: '5px', paddingBottom:'10px' }}>
                        <p>Home telephone no: {data["Home telephone no"]}</p>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
);
const ApplicantQualificationsSection = ({ data }: any) => (
  <div className="WordSection2" style={{fontFamily: 'Arial, sans-serif'}}>
        <table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
            <thead>
            <tr style={{ backgroundColor: '#B8CCE4' }}>
                <th colSpan={12} style={{ fontSize:'14pt', padding: '8px', textAlign: 'left', border: '1px solid black' }}>
                4. Prior Attainment/Highest Previous Qualifications - please tick ONE box only: 
                </th>
            </tr>
            </thead>
            <tbody style={{fontSize: '12pt'}}>
                <tr style={{ border: '1px solid black'}}>
                    <td style={{ padding: '5px', paddingBottom:'10px' }}>
                        {getMarker(data["Prior Attainment/Highest Previous Qualifications - please tick ONE box only"], "No record of attainment (have not attained any qualifications)")} No record of attainment (have not attained any qualifications)<br/>
                        {getMarker(data["Prior Attainment/Highest Previous Qualifications - please tick ONE box only"], "Entry Level (Basic Entry Level, E)")} Entry Level (Basic Entry Level, E)<br/>
                        {getMarker(data["Prior Attainment/Highest Previous Qualifications - please tick ONE box only"], "Level 1 (5GCSEs D-G/3-1; 1 AS Level; GNVQ Foundation; BTEC First Certificate)")} Level 1 (5GCSEs D-G/3-1; 1 AS Level; GNVQ Foundation; BTEC First Certificate)<br/>
                        {getMarker(data["Prior Attainment/Highest Previous Qualifications - please tick ONE box only"], "Level 2 (5 GCSEs A*-C/9-4; NVQ2; 2 or 3 AS Levels; GNVQ Intermediate; BTEC First Diploma)")} Level 2 (5 GCSEs A*-C/9-4; NVQ2; 2 or 3 AS Levels; GNVQ Intermediate; BTEC First Diploma)<br/>
                        {getMarker(data["Prior Attainment/Highest Previous Qualifications - please tick ONE box only"], "Level 3 (4 AS Level; 2 A2/A Level; NVQ3; BTEC Diploma/Extended Diploma/Access to HE)")} Level 3 (4 AS Level; 2 A2/A Level; NVQ3; BTEC Diploma/Extended Diploma/Access to HE)<br/>
                    </td>
                    <td style={{ padding: '5px', paddingBottom:'10px' }}>
                        {getMarker(data["Prior Attainment/Highest Previous Qualifications - please tick ONE box only"], "Level 4 (Certificate of Higher Education; HNC)")} Level 4 (Certificate of Higher Education; HNC)<br/>
                        {getMarker(data["Prior Attainment/Highest Previous Qualifications - please tick ONE box only"], "Level 5 (Foundation Degree; HND)")} Level 5 (Foundation Degree; HND)<br/>
                        {getMarker(data["Prior Attainment/Highest Previous Qualifications - please tick ONE box only"], "Level 6 (Bachelor's Degree; Graduate qualification)")} Level 6 (Bachelor's Degree; Graduate qualification)<br/>
                        {getMarker(data["Prior Attainment/Highest Previous Qualifications - please tick ONE box only"], "Level 7 (Master's Degree; Postgraduate qualification)")} Level 7 (Master's Degree; Postgraduate qualification)<br/>
                        {getMarker(data["Prior Attainment/Highest Previous Qualifications - please tick ONE box only"], "Level 8 (Doctorate, PhD)")} Level 8 (Doctorate, PhD)<br/>
                        {getMarker(data["Prior Attainment/Highest Previous Qualifications - please tick ONE box only"], "Other qualification: level not known")} Other qualification: level not known<br/>
                        {getMarker(data["Prior Attainment/Highest Previous Qualifications - please tick ONE box only"], "Not known")} Not known<br/><br/>
                    </td>
                </tr>
                <tr>
                <td style={{ padding: '5px', paddingBottom:'10px' }}>If you completed a level 6 qualification or higher, please select which subject this was in:</td>
                </tr>
                <tr>
                    <td style={{ padding: '5px', paddingBottom:'10px' }}>
                        {getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], "Medicine and dentistry")} Medicine and dentistry<br/>
                        {getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], "Subjects allied to medicine")} Subjects allied to medicine<br/>
                        {getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], "Biological and sport sciences")} Biological and sport sciences<br/>
                        {getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], "Psychology")} Psychology<br/>
                        {getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], "Veterinary sciences")} Veterinary sciences<br/>
                        {getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], "Agriculture, food and related studies")} Agriculture, food and related studies<br/>
                        {getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], "Physical sciences")} Physical sciences<br/>
                        {getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], "General and others in sciences")} General and others in sciences<br/>
                        {getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], "Mathematical sciences")} Mathematical sciences<br/>
                        {getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], "Engineering and technology")} Engineering and technology<br/>
                        {getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], "Computing")} Computing<br/>
                        {getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], "Geographical and environmental studies (natural sciences)")} Geographical and environmental studies (natural sciences)<br/><br/>
                    </td>
                    <td style={{ padding: '5px', paddingBottom:'10px' }}>
                        {getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], "Architecture, building and planning")} Architecture, building and planning<br/>
                        {getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], "Geographical and environmental studies (social sciences)")} Geographical and environmental studies (social sciences)<br/>
                        {getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], "Humanities and liberal arts (non-specific)")} Humanities and liberal arts (non-specific)<br/>
                        {getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], "Social sciences")} Social sciences<br/>
                        {getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], "Law")} Law<br/>
                        {getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], "Business and management")} Business and management<br/>
                        {getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], "Communications and media")} Communications and media<br/>
                        {getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], "Language and area studies")} Language and area studies<br/>
                        {getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], "Historical, philosophical and religious studies")} Historical, philosophical and religious studies<br/>
                        {getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], "Creative arts and design")} Creative arts and design<br/>
                        {getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], "Education and teaching")} Education and teaching<br/>
                        {getMarker(data["If you completed a level 6 qualification or higher, please select which subject this was in"], "Combined and general studies")} Combined and general studies<br/><br/>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
);
const ApplicantEmploymentSection = ({ data, variant }: any) => (
  <div className="WordSection2" style={{fontFamily: 'Arial, sans-serif'}}>
        <table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
            <thead>
            <tr style={{ backgroundColor: '#B8CCE4' }}>
                <th colSpan={12} style={{ fontSize:'14pt', padding: '8px', textAlign: 'left', border: '1px solid black' }}>
                5. Employment Information 
                </th>
            </tr>
            </thead>
            <tbody style={{fontSize: '12pt'}}>
                <tr>
                    <td style={{ width:"33%", border: '1px solid black', padding: '5px', paddingBottom:'10px' }}>
                        1.	On the day prior to this course, what is your employment status? (please tick one)
                    </td>
                    <td style={{ width:"40%", border: '1px solid black', padding: '5px', paddingBottom:'10px' }}>
                        2. <b>If employed</b>, please state <b>name of your employer</b>, the <b>postcode</b> of your workplace, your <b>current job role</b>, industry/sector of current job, number of <b>hours worked per week</b> and your <b>current salary</b> (if more than 1 job, please state details for main employer):
                    </td>
                    <td style={{ width:"26%", border: '1px solid black', padding: '5px', paddingBottom:'10px' }}>
                        3. Do you currently receive any of the following?
                    </td>
                </tr>
                <tr>
                    <td style={{ width:"33%", border: '1px solid black', padding: '5px', paddingBottom:'10px' }}>
                        {getMarker(data["On the day prior to this course, what is your employment status? (please select one)"], "in full-time employment")} in full-time employment<br/>
                        {getMarker(data["On the day prior to this course, what is your employment status? (please select one)"], "in part-time employment")} in part-time employment<br/>
                        {getMarker(data["On the day prior to this course, what is your employment status? (please select one)"], ["Employed – zero-hour contract", "Employed - zero-hour contract"])} Employed – zero-hour contract<br/>
                        {getMarker(data["On the day prior to this course, what is your employment status? (please select one)"], "Self-employed")} Self-employed<br/>
                        {getMarker(data["On the day prior to this course, what is your employment status? (please select one)"], "Unemployed less than 6 months")} Unemployed less than 6 months<br/>
                        {getMarker(data["On the day prior to this course, what is your employment status? (please select one)"], "Unemployed for 6-11 months")} Unemployed for 6-11 months<br/>
                        {getMarker(data["On the day prior to this course, what is your employment status? (please select one)"], "Unemployed for 12-23 months")} Unemployed for 12-23 months<br/>
                        {getMarker(data["On the day prior to this course, what is your employment status? (please select one)"], "Unemployed for 24-35 months")} Unemployed for 24-35 months<br/>
                        {getMarker(data["On the day prior to this course, what is your employment status? (please select one)"], "Unemployed for 36 months or over")} Unemployed for 36 months or over<br/>
                        {getMarker(data["On the day prior to this course, what is your employment status? (please select one)"], "In full-time education or training")} In full-time education or training<br/>
                        {getMarker(data["On the day prior to this course, what is your employment status? (please select one)"], ["Not working – long term sickness", "Not working - long term sickness"])} Not working – long term sickness<br/>
                        {getMarker(data["On the day prior to this course, what is your employment status? (please select one)"], ["Not working – caring responsibilities", "Not working - caring responsibilities"])} Not working – caring responsibilities<br/>
                        {getMarker(data["On the day prior to this course, what is your employment status? (please select one)"], "Prisoner")} Prisoner<br/>
                        {getMarker(data["On the day prior to this course, what is your employment status? (please select one)"], "Retired")} Retired<br/>
                    </td>
                    <td style={{ width:"40%", border: '1px solid black', padding: '5px', paddingBottom:'10px' }}>
                        Name of employer: {data["Name of Employer"]}<br/>
                        <br/>
                        Workplace postcode: {data["Workplace postcode"].toUpperCase()}<br/>
                        <br/>
                        Current job title: {data["Current Job Title"]}<br/>
                        <br/>
                        Industry / sector of current occupation: {data["Industry/sector of current occupation"]}<br/>
                        <br/>
                        Hours worked per week: {data["Hours worked per week"]}<br/>
                        <br/>
                        Current salary (please specify if hourly rate, weekly, monthly or yearly): {data["Current Salary (please specify if hourly rate, weekly, monthly or yearly)"]}<br/>
                        <br/>
                    </td>
                    <td style={{ width:"26%", border: '1px solid black', padding: '5px', paddingBottom:'10px' }}>
                        {getMarker(data["Do you currently receive any of the following?"], "In receipt of JSA")} In receipt of JSA<br/>
                        {getMarker(data["Do you currently receive any of the following?"], "In receipt of ESA (Part of WRAG group)")} In receipt of ESA (Part of WRAG group)<br/>
                        {getMarker(data["Do you currently receive any of the following?"], "In receipt of Universal Credit")} In receipt of Universal Credit<br/>
                        {getMarker(data["Do you currently receive any of the following?"], "In receipt of another State Benefit")} In receipt of another State Benefit<br/>
                        {getMarker(data["Do you currently receive any of the following?"], "None")} None<br/>
                    </td>
                </tr>
                <tr style={{ border: '1px solid black', padding: '5px', paddingBottom:'10px' }}>
                    <td colSpan={3} style={{padding: '5px', paddingBottom:'10px' }}>
                        4. <b>If employed</b>, are you attending this {variant.type} via your current employer (has applicant been sent on the bootcamp through their current employment)?
                        <br/><br/>
                        {getMarker(data["If employed, are you attending this bootcamp via your current employer (has applicant been sent on the bootcamp through their current employment)?"], "Yes")} Yes<br/>
                        {getMarker(data["If employed, are you attending this bootcamp via your current employer (has applicant been sent on the bootcamp through their current employment)?"], "No")} No<br/>
                        {getMarker(data["If employed, are you attending this bootcamp via your current employer (has applicant been sent on the bootcamp through their current employment)?"], "N/A - not in paid employment")} N/A – not in paid employment<br/>
                        <br/>
                    </td>
                </tr>
                <tr style={{ border: '1px solid black', padding: '5px', paddingBottom:'10px' }}>
                    <td colSpan={3} style={{padding: '5px', paddingBottom:'10px' }}>
                        5. Do you plan to work alongside the {variant.type}?<br/><br/>
                        {getMarker(data["Do you plan to work alongside the bootcamp?"], "Yes (Full-time employment)")} - Yes (Full-time employment)	{getMarker(data["Do you plan to work alongside the bootcamp?"], "Yes (Self-employed)")} - Yes (Self-employed)<br/>
                        {getMarker(data["Do you plan to work alongside the bootcamp?"], "Yes (Part time employed)")} - Yes (Part time employed)    {getMarker(data["Do you plan to work alongside the bootcamp?"], "No")} - No<br/>
                        <br/>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
);
const ApplicantDisabilitySection = ({ data }: any) => (
  <div className="WordSection2" style={{fontFamily: 'Arial, sans-serif'}}>
        <table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
            <thead>
            <tr style={{ backgroundColor: '#B8CCE4' }}>
                <th colSpan={12} style={{ fontSize:'14pt', padding: '8px', textAlign: 'left', border: '1px solid black' }}>
                6.	Disability, Learning Difficulty and or Long Term Health Condition – please tick all that apply, if no option is indicated the starred * option will be selected
                </th>
            </tr>
            </thead>
            <tbody style={{fontSize: '12pt'}}>
                <tr>
                    <td colSpan={3} style={{ border: '1px solid black', padding: '5px', paddingBottom:'10px' }}>
                        Do you consider that you have a learning difficulty, disability or long term health condition?
                        <br />
                        Yes {getMarker(data["Do you consider that you have a learning difficulty, disability or long term health condition?"], "Yes")}	*No {getMarker(data["Do you consider that you have a learning difficulty, disability or long term health condition?"], "No")}	Prefer not to say {getMarker(data["Do you consider that you have a learning difficulty, disability or long term health condition?"], ["Prefer Not to Say", "Prefer not to say"])}
                    </td>
                </tr>
                <tr>
                    <td style={{ border: '1px solid black', padding: '5px', paddingBottom:'10px' }}>
                        {getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Allergy")} Allergy<br/>
                        {getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Asperger’s Syndrome")} Asperger’s Syndrome<br/>
                        {getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Asthma")} Asthma<br/>
                        {getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Autism Spectrum Condition")} Autism Spectrum Condition<br/>
                        {getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Cystic Fibrosis")} Cystic Fibrosis<br/>
                        {getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Diabetes")} Diabetes<br/>
                        {getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Disability Affecting Mobility")} Disability Affecting Mobility<br/>
                        {getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Dyscalculia")} Dyscalculia<br/>
                        {getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Dyslexia")} Dyslexia<br/>
                    </td>
                    <td style={{ border: '1px solid black', padding: '5px', paddingBottom:'10px' }}>
                        {getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Epilepsy")} Epilepsy<br/>
                        {getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Hearing Impairment")} Hearing Impairment<br/>
                        {getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Diagnosed mental health condition")} Diagnosed mental health condition<br/>
                        {getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Moderate Learning Difficulty")} Moderate Learning Difficulty<br/>
                        {getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Physical Disability")} Physical Disability<br/>
                        {getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Other Specific Learning Difficulty e.g. Dyspraxia")} Other Specific Learning Difficulty e.g. Dyspraxia<br/>
                        {getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Profound/Complex Disabilities")} Profound/Complex Disabilities<br/>
                        {getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Severe Learning Difficulty")} Severe Learning Difficulty<br/>
                    </td>
                    <td style={{ border: '1px solid black', padding: '5px', paddingBottom:'10px' }}>
                        {getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Social, Emotional & Behavioural Difficulties")} Social, Emotional & Behavioural Difficulties<br/>
                        {getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Speech, Language and Communication needs")} Speech, Language and Communication needs<br/>
                        {getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Temporary Disability after Illness or accident")} Temporary Disability after Illness or accident<br/>
                        {getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Visual Impairment-excluding glasses/contact lenses")} Visual Impairment-excluding glasses/contact lenses<br/>
                        {getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Prefer not to say")} Prefer not to say<br/>
                        {getMultiMarker(data["If yes to previous question, please list the learning difficulty, disability or long term health condition you have (Please select all that apply)"], "Are you a wheelchair user?")} Are you a wheelchair user?<br/>
                    </td>
                </tr>
                <tr style={{ border: '1px solid black', padding: '5px', paddingBottom:'10px' }}>
                    <td colSpan={2} style={{ padding: '5px', paddingBottom:'10px' }}>
                       If you have ticked more than one of the above, please state which disability, learning difficulty and/or health condition impacts most on your learning<br/><br/>
                        {data["If you have selected more than one of the above, please state which disability, learning difficulty and/or health condition impacts most on your learning"]}
                    </td>
                </tr>
                <tr style={{ border: '1px solid black', padding: '5px', paddingBottom:'10px' }}>
                    <td colSpan={3} style={{ border: '1px solid black', padding: '5px', paddingBottom:'10px' }}>
                        If you have a support need and would benefit from a confidential interview, please tick this box {normalize(data["Do you a have support need and would benefit from a confidential interview"]) == "yes" ? "☒" : "☐"}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
);
const ApplicantMarketingSection = ({ data }: any) => (
  <div className="WordSection2" style={{fontFamily: 'Arial, sans-serif'}}>
        <table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
            <thead>
            <tr style={{ backgroundColor: '#B8CCE4' }}>
                <th colSpan={12} style={{ fontSize:'14pt', padding: '8px', textAlign: 'left', border: '1px solid black' }}>
                7. Contact and Marketing Information
                </th>
            </tr>
            </thead>
            <tbody style={{fontSize: '12pt'}}>
                <tr>
                    <td colSpan={3} style={{ border: '1px solid black', padding: '5px', paddingBottom:'10px' }}>
                        How did you hear about us?<br/>                        
                        {getMarker(data["How did you hear about us?"], "Current Employer")} Current Employer<br/>
                        {getMarker(data["How did you hear about us?"], "Job Centre / Work Coach / DWP")} Job Centre / Work Coach / DWP<br/>
                        {getMarker(data["How did you hear about us?"], "Social Media")} Social Media<br/>
                        {getMarker(data["How did you hear about us?"], "Friends / Family")} Friends / Family<br/>
                        {getMarker(data["How did you hear about us?"], "FE college / training provider")} FE college / training provider<br/>
                        {getMarker(data["How did you hear about us?"], "The National Careers Servic")} The National Careers Service<br/>
                        {getMarker(data["How did you hear about us?"], "Gov.uk website")} Gov.uk website<br/>
                        {getMarker(data["How did you hear about us?"], "Other (e.g. search engine, local media press)")} Other (e.g. search engine, local media press)<br/>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
);
const ApplicantDeclarationSection = ({ data, variant }: any) => (
  <div className="WordSection2" style={{fontFamily: 'Arial, sans-serif'}}>
        <table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
            <thead>
            <tr style={{ backgroundColor: '#B8CCE4' }}>
                <th colSpan={12} style={{ fontSize:'14pt', padding: '8px', textAlign: 'left', border: '1px solid black' }}>
                8. Learner Declaration and Commitment 
                </th>
            </tr>
            </thead>
            <tbody style={{fontSize: '11pt'}}>
                <tr>
                    <td colSpan={3} style={{ border: '1px solid black', padding: '5px', paddingBottom:'10px' }}>
                        I agree that initial assessment and information advice and guidance concerning the course has been provided to me, this included information about the course, its entry requirements, the implications of the choice of course, its suitability and the support which is available to me. I agree that the information given on this agreement is true, correct and completed to the best of my knowledge and I understand that Verciti has the right to cancel my enrolment if it is found that I have provided false or inaccurate information. I agree that this information can be used to process my data for any purposes connected with my studies or my health and safety whilst on the premises. This also includes any other contractual requirements and, in particular to the disclosure of all the data on this form or otherwise collected about me to {variant.department} for the purposes noted in the <Link className="link" href="https://www.gov.uk/government/publications/office-for-clean-energy-jobs-regional-skills-pilot-privacy-notice/office-for-clean-energy-jobs-regional-skills-pilot-privacy-notice">Privacy Notice</Link>. I also agree with the below points relating to my chosen programme: 

                        - Take appropriate responsibility for my own learning, development and progression<br/>
                        - Attend and undertake training required to achieve the Skills Bootcamp identified in Programme Details in the ILP<br/>
                        - Promptly inform the Employer and/or Verciti if any matters or issues arise, or might arise, that will, or may, affect my learning, development and progression<br/>
                        - All times behave in a safe and responsible manner and in accordance with the statutory requirements of health and safety law relating to my responsibilities from time to time<br/>
                        - Comply with the policies, regulations and procedures of my Employer and/or Verciti, notified to me from time to time;<br/><br/>
                        If you wish to raise a complaint about how we have handled your personal data email to Verciti or any other issues, please email info@verciti.com with full details of your issue. If you are not satisfied how your complaint has been dealt with, please be aware of Authority’s Whistleblowing and Complaints policies and processes. {variant.whistleblowing}<br/><br/>
                        Your information may also be shared with other third parties for the above purposes, but only where the law allows it and the sharing is in compliance with data protection legislation. You can agree to be contacted for other purposes by ticking any of the following boxes:<br/><br/>

                        {getMarker(data["Your information may also be shared with other third parties for the above purposes, but only where the law allows it and the sharing is in compliance with data protection legislation. You can agr..."], "About courses or learning opportunities")} About courses or learning opportunities<br/>
                        {getMarker(data["Your information may also be shared with other third parties for the above purposes, but only where the law allows it and the sharing is in compliance with data protection legislation. You can agr..."], "For research and evaluation purposes")} For research and evaluation purposes<br/>
                        {getMarker(data["Your information may also be shared with other third parties for the above purposes, but only where the law allows it and the sharing is in compliance with data protection legislation. You can agr..."], "By post")} By post<br/>
                        {getMarker(data["Your information may also be shared with other third parties for the above purposes, but only where the law allows it and the sharing is in compliance with data protection legislation. You can agr..."], "By phone")} By phone<br/>
                        {getMarker(data["Your information may also be shared with other third parties for the above purposes, but only where the law allows it and the sharing is in compliance with data protection legislation. You can agr..."], "By email")} By email<br/>
                        <br/>
                        I agree to visual images being used for marketing purposes<br/>
                        {getMarker(data["I agree to visual images being used for marketing purposes"], "Yes")} Yes<br/>
                        {getMarker(data["I agree to visual images being used for marketing purposes"], "No")} No
                        <br/>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
);
const ApplicantSignSection = ({ data }: any) => {
    return (
        <div className="WordSection2" style={{ fontFamily: 'Arial, sans-serif' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
                <tbody style={{fontSize: '12pt'}}>
                    <tr>
                        <td style={{ border: '1px solid black', padding: '5px', paddingBottom:'10px' }}>
                            Learner Name
                        </td>
                        <td style={{ width: '80%', border: '1px solid black', padding: '5px', paddingBottom:'10px' }}></td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid black', padding: '5px', paddingBottom:'10px' }}>
                            Signature
                        </td>
                        <td style={{ width: '80%', border: '1px solid black', padding: '5px', paddingBottom:'10px' }}></td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid black', padding: '5px', paddingBottom:'10px' }}>
                            Date
                        </td>
                        <td style={{ width: '80%', border: '1px solid black', padding: '5px', paddingBottom:'10px' }}
                        ></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
const PrintableApplication = ({data, variant, index}: any) => (
    <div>
        <ApplicantInfoSection data={data} variant={variant}/>
        <ApplicantEthnicSection data={data} />
        <div className="page-break"></div>
        <br/>
        <ApplicantEmergencyContactSection data={data} />
        <div className="page-break"></div>
        <br/>
        <ApplicantQualificationsSection data={data} />
        <div className="page-break"></div>
        <br/>
        <ApplicantEmploymentSection data={data} variant={variant} />
        <div className="page-break"></div>
        <br/>
        <ApplicantDisabilitySection data={data} />
        <br/>
        <ApplicantMarketingSection data={data} />
        <div className="page-break"></div>
        <br/>
        <ApplicantDeclarationSection data={data} variant={variant} />
        <div className="page-break"></div>
        <br/>
        <ApplicantSignSection data={data} />
    </div>
);

const CohortSelect = (props: any) =>{
    const uniqueCohorts = useMemo<string[]>(() => {
        const cohorts = (props.entries || []).map((entry: any) => {
            const cohortKey = Object.keys(entry).find(
            key => key.trim() === "Cohort"
            );

            return cohortKey ? String(entry[cohortKey]).trim() : "";
        });

        return Array.from(new Set(cohorts.filter(Boolean)));
    }, [props.entries]);

  return (
    <select
      value={props.selectedCohort}
      onChange={(e) => props.setSelected(e.target.value)}
      className="dark w-full p-2 border rounded"
    >
      <option value="" disabled>
        Select a cohort
      </option>
      {uniqueCohorts.map((cohort, index) => (
        <option key={index} value={String(cohort)}>
          {`Cohort ${String(cohort)}`}
        </option>
      ))}
    </select>
  );
}

const SkillsBootCampVariant = {
    id:"skills-bootcamp",
    header: "Skill Bootcamp",
    type: "bootcamp",
    department:"the DfE",
    whistleblowing:`Whistleblowing involves entering a 'whistleblowing' webform on the 'Contact the Department for Education' page, which can be found below: Contact the Department for Education - DFE Online Forms. Whistleblowing entries for Skills Bootcamps must be clearly marked as 'Skills Bootcamps' and will submitted via the DfE's whistleblowing submission process and will be escalated to the relevant policy team.`
}
const RegionalSkillsVariant = {
    id:"regional-skills-pilot",
    header: "Regional Skills Pilot Short Course",
    type: "course",
    department:"DESNZ",
    whistleblowing:``
}
const FormVariantSelect = (props: any) =>{
    return(
        <select 
            value={props.formVariantId}
            onChange={(e) => props.setSelected(e.target.value)}
            className="dark w-full p-2 border rounded"
            >
            <option value="" disabled>
                Select a variant
            </option>
            {props.variants.map((variant: any, index: any) => (
                <option key={index} value={variant.id}>
                    {`${variant.header}`}
                </option>
            ))}
        </select>
    )
}

export default function PrintableApplicantFormTool() {
    const [user, setUser] = useState<User | null>(null);
    const [entries, setEntries] = useState<any[]>([]);
    const [selectedCohort, setSelectedCohort] = useState("");
    const [formVariantId, setFormVariantId] = useState("");
    const [selectedFormVariant, setSelectedFormVariant] = useState<any>(undefined);
    const [csvUrl, setCsvUrl] = useState("");
    const formRefs = useRef<(HTMLDivElement | null)[]>([]);

    const [emailListText, setEmailListText] = useState("");
    const [emailList, setEmailList] = useState<string[]>([]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                console.log("Parsed Results:", results.data);
                setEntries(results.data);
            },
        });
    };

    const generateAndDownloadDocx = async () => {
        for (let i = 0; i < entries.length; i++) {
            const data = entries[i];
            if(data['Cohort'] !== selectedCohort){ continue; }

            console.log("DATA");
            console.log(data);

            const emailAddress = data["Email Address"]?.toLowerCase().trim();

            if (emailList.length > 0 && !emailList.includes(emailAddress)) {
                console.log(`Skipping entry ${i + 1} with email ${emailAddress} not in email list\n${data}`);
                continue;
            }

            const response = await fetch("/api/pdf/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data, variant: selectedFormVariant }),
            });

            if (!response.ok) {
                console.error(`Failed to generate document for entry ${i + 1}`);
                continue;
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            
            const now = new Date();
            const timestamp = now.toISOString().replace(/[:.]/g, '-').replace('T', '_').replace('Z', '');
            
            const a = document.createElement("a");
            a.href = url;
            a.download = `generated-${data["Email Address"]}-${timestamp}.docx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        }
    };

    const formVariants = [SkillsBootCampVariant, RegionalSkillsVariant];

    const getVariantById = (vid: string) =>{
        return formVariants.find(variant => variant.id === vid);
    }

    useEffect(() => {
        const init = async () => {
            const users = await checkUser();
            if (users) { setUser(users.testUser); }
        };
        init();
    }, [user]);

    useEffect(() => {
        console.log("entries changed");
    }, [entries])

    useEffect(() => {
        console.log(`form variant changed: ${formVariantId}`);
        setSelectedFormVariant(getVariantById(formVariantId));
    }, [formVariantId])

    if(!user){ return <Login setUserFunc={setUser} user={user} /> }

    return (
        <div className="dark bg-background text-foreground">
            <div className="grid items-center justify-items-center min-h-screen p-8 pb-20">
            <div className="grid w-full max-w-sm items-center gap-3">
                <label>Upload CSV File</label>
                <Input type="file" accept=".csv" onChange={handleFileUpload} />
                <br/>
                <p>Select a cohort from the list below</p>
                <CohortSelect entries={entries} selectedCohort={selectedCohort} setSelected={setSelectedCohort} />
                <br/>
                <FormVariantSelect variants={formVariants} formVariantId={formVariantId} setSelected={setFormVariantId} /> 
                <br/>
                <p>You have selected <b>cohort {selectedCohort}</b> for printing</p>
            </div>

            <Button className="green-shadcn-button mt-4" onClick={generateAndDownloadDocx}>
                Create DOCX Files
            </Button>

            {selectedFormVariant == undefined ? 
                    <p>No form variant selected</p>
                :
                entries.map((entry, index) => (
                    entry["Completion time"] != "" && entry["Completion time"] != null ?
                    (<div
                        key={index}
                        className="printable-form my-4 p-4 border rounded"
                        style={{
                            color: "#000",
                            backgroundColor: "#fff",
                            fontFamily: "Arial, sans-serif",
                        }}
                        ref={(el) => {
                            formRefs.current[index] = el;
                        }}
                    >
                        <PrintableApplication data={entry} variant={selectedFormVariant} index={index} />
                    </div>) : null
                ))
            }            
            </div>
        </div>
    );
}