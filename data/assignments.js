const REMINDERS = [
  'Color-coded rags: 🔵 Blue = Glass/mirrors  |  🟡 Yellow = General surfaces  |  🔴 Red = High-risk (toilets, bins, diaper stations)',
  'No outside cleaning products — Assembly Hall supplies ONLY',
  'Sort soiled towels by color into marked bins — bring ALL to Cleaning Desk at end of event',
  'Do NOT wash towels or operate laundry equipment',
  'Report all spills immediately to Cleaning Overseer or Convention Committee',
  'Always use wet floor signs on any wet surface',
  'Tag faulty equipment and notify Assembly Hall event contact'
];

const SEC_A_MAIN = {
  title: 'Zone 2 South — Right Half of Main Auditorium',
  tasks: [
    'Wipe down all door handles, knobs, and light switches — yellow rags',
    'Wipe down armrests on seats — yellow rags',
    'Vacuum carpet throughout the right half of the auditorium (row by row, front to back)',
    'Check for any items left under or between seats'
  ]
};

const SEC_A_RESTROOM = {
  title: "Auditorium Women's Restroom",
  tasks: [
    'Wipe down all door handles, knobs, light switches, and stall latches — yellow rags',
    'Clean all mirrors — blue rags',
    'Clean and disinfect all toilets — red rags',
    'Wipe down all stall partitions, doors, and hardware — yellow rags',
    'Clean and disinfect diaper changing stations — red rags',
    'Clean and disinfect all sinks, faucets, and paper product dispensers',
    'Empty all trash bins, clean inside and out, replace ALL liners (including feminine hygiene) — red rags',
    'Sweep and mop floor with disinfectant solution — use wet floor signs',
    'Clean and restock supply closet — leave orderly for next day'
  ]
};

const SEC_B_MAIN = {
  title: 'Zone 2 North — Left Half of Main Auditorium',
  tasks: [
    'Wipe down all door handles, knobs, and light switches — yellow rags',
    'Wipe down armrests on seats — yellow rags',
    'Vacuum carpet throughout the left half of the auditorium (row by row, front to back)',
    'Check for any items left under or between seats'
  ]
};

const makeSEC_C_DINING = (isSunday) => ({
  title: 'Zone 6 — Dining Room & Patios',
  tasks: [
    'Clean and wipe down all dining tables and seats — yellow rags',
    'Wipe down all door handles and light switches — yellow rags',
    'Clean all glass surfaces — blue rags',
    'Clean and disinfect all drinking fountains',
    'Spot vacuum under dining tables as needed',
    'Pick up loose trash around outside dining areas and property perimeter (wear high-vis vests from Parking Dept.)',
    'Empty all trash bins, clean receptacles, replace ALL liners — including patio bins',
    isSunday
      ? '⚠️ SUNDAY END-OF-CONVENTION: All trash gondolas must be emptied, washed, and tilted to drain regardless of liner condition'
      : 'Trash gondolas — check liner: if intact replace liner only; if split/broken/liquid present, empty, wash, tilt to drain, then reline',
    'Dust mop all floors; spot mop any spills or sticky residue',
    'Clean and restock supply closet — leave orderly for next day'
  ]
});

const SEC_C_WEST_AUD = {
  title: 'Zone 9 — West Auditorium',
  tasks: [
    'Wipe down all door handles, knobs, and light switches — yellow rags',
    'Wipe down armrests on seats — yellow rags',
    'Vacuum carpet throughout the West Auditorium',
    'Clean all glass surfaces — blue rags'
  ]
};

const SEC_D_LOBBIES = {
  title: 'Zone 5 — Entrances & Lobbies',
  tasks: [
    'Wipe down all door handles, knobs, light switches, push plates, and pull bars — yellow rags',
    'Clean all glass doors, windows, and mirrors — blue rags',
    'Clean and disinfect all drinking fountains',
    'Empty all trash bins, clean receptacles, replace ALL liners',
    'Vacuum all entrance mats and rugs thoroughly',
    'Dust mop all hard floors; spot mop any spills, sticky residue, or footprints'
  ]
};

const SEC_D_MENS = {
  title: "Zone 3 — Main Men's Restroom",
  tasks: [
    'Wipe down all door handles, knobs, light switches, and stall latches — yellow rags',
    'Clean all mirrors — blue rags',
    'Clean and disinfect all toilets and urinals — red rags',
    'Wipe down all stall partitions, doors, and hardware — yellow rags',
    'Clean and disinfect diaper changing stations — red rags',
    'Clean and disinfect all sinks, faucets, and paper product dispensers',
    'Empty all trash bins, clean inside and out, replace ALL liners — red rags',
    'Sweep and mop floor with disinfectant solution — use wet floor signs',
    'Clean and restock supply closet — leave orderly for next day'
  ]
};

const SEC_E_WOMENS = {
  title: "Zone 4 — Main Women's Restroom",
  note: '⚠️ Sister volunteers handle interior cleaning. Brothers assist from outside only (trash, mopping from entrance, restocking).',
  tasks: [
    'Wipe down all door handles, knobs, light switches, and stall latches — yellow rags',
    'Clean all mirrors — blue rags',
    'Clean and disinfect all toilets — red rags',
    'Wipe down all stall partitions, doors, and hardware — yellow rags',
    'Clean and disinfect diaper changing stations — red rags',
    'Clean and disinfect all sinks, faucets, and paper product dispensers',
    'Clean exterior of feminine hygiene dispensers',
    'Empty all trash bins, clean inside and out, replace ALL liners including all feminine hygiene units in every stall — red rags',
    'Sweep and mop floor — pay attention to corners and under fixtures',
    'Use wet floor signs inside and outside the restroom',
    'Clean and restock supply closet — leave orderly for next day'
  ]
};

const SEC_FINAL = {
  title: 'Final Steps',
  tasks: [
    'Complete final walkthrough with captain — verify all tasks are done',
    'Sign off with assistant overseer before leaving'
  ]
};

const ASSIGNMENTS = {
  'fri-a': {
    code: 'fri-a',
    day: 'Friday, June 12',
    dayShort: 'Fri',
    assignment: 'A',
    congregation: 'Anclote',
    location: 'Holiday, FL',
    captain: "Carson O'Donnell",
    captainPhone: '7274093933',
    area: 'Zone 2 South — Auditorium Right & Aud. Women\'s Restroom',
    assistantOverseer: 'Pierson Mims',
    assistantPhone: '7274521651', // TEMP TEST — restore to 7274394490 after test
    sections: [SEC_A_MAIN, SEC_A_RESTROOM, SEC_FINAL],
    reminders: REMINDERS
  },
  'fri-b': {
    code: 'fri-b',
    day: 'Friday, June 12',
    dayShort: 'Fri',
    assignment: 'B',
    congregation: 'Countryway',
    location: 'Tampa, FL',
    captain: null,
    captainPhone: null,
    area: 'Zone 2 North — Auditorium Left',
    assistantOverseer: 'Pierson Mims',
    assistantPhone: '7274394490',
    sections: [SEC_B_MAIN, SEC_FINAL],
    reminders: REMINDERS
  },
  'fri-c': {
    code: 'fri-c',
    day: 'Friday, June 12',
    dayShort: 'Fri',
    assignment: 'C',
    congregation: 'Crescent Heights',
    location: 'St. Petersburg, FL',
    captain: null,
    captainPhone: null,
    area: 'Dining Room & West Auditorium — Zones 6 & 9',
    assistantOverseer: 'Harold Taylor',
    assistantPhone: '7278088547',
    sections: [makeSEC_C_DINING(false), SEC_C_WEST_AUD, SEC_FINAL],
    reminders: REMINDERS
  },
  'fri-d': {
    code: 'fri-d',
    day: 'Friday, June 12',
    dayShort: 'Fri',
    assignment: 'D',
    congregation: 'Hudson',
    location: 'Hudson, FL',
    captain: 'Rob Ward',
    captainPhone: '7273646203',
    area: 'Lobbies, Hallways & Men\'s Restroom — Zones 3 & 5',
    assistantOverseer: 'Harold Taylor',
    assistantPhone: '7278088547',
    sections: [SEC_D_LOBBIES, SEC_D_MENS, SEC_FINAL],
    reminders: REMINDERS
  },
  'fri-e': {
    code: 'fri-e',
    day: 'Friday, June 12',
    dayShort: 'Fri',
    assignment: 'E',
    congregation: 'Northdale',
    location: 'Tampa, FL',
    captain: null,
    captainPhone: null,
    area: "Main Women's Restroom — Zone 4",
    assistantOverseer: 'Harold Taylor',
    assistantPhone: '7278088547',
    sections: [SEC_E_WOMENS, SEC_FINAL],
    reminders: REMINDERS
  },
  'sat-a': {
    code: 'sat-a',
    day: 'Saturday, June 13',
    dayShort: 'Sat',
    assignment: 'A',
    congregation: 'Pinellas Pointe',
    location: 'St. Petersburg, FL',
    captain: 'Justin Defreitas',
    captainPhone: '7274246167',
    area: 'Zone 2 South — Auditorium Right & Aud. Women\'s Restroom',
    assistantOverseer: 'Pierson Mims',
    assistantPhone: '7274394490',
    sections: [SEC_A_MAIN, SEC_A_RESTROOM, SEC_FINAL],
    reminders: REMINDERS
  },
  'sat-b': {
    code: 'sat-b',
    day: 'Saturday, June 13',
    dayShort: 'Sat',
    assignment: 'B',
    congregation: 'Scott Lake',
    location: 'Lakeland, FL',
    captain: null,
    captainPhone: null,
    area: 'Zone 2 North — Auditorium Left',
    assistantOverseer: 'Pierson Mims',
    assistantPhone: '7274394490',
    sections: [SEC_B_MAIN, SEC_FINAL],
    reminders: REMINDERS
  },
  'sat-c': {
    code: 'sat-c',
    day: 'Saturday, June 13',
    dayShort: 'Sat',
    assignment: 'C',
    congregation: 'Skyview',
    location: 'Pinellas Park, FL',
    captain: 'Brian Howard',
    captainPhone: '7274608580',
    area: 'Dining Room & West Auditorium — Zones 6 & 9',
    assistantOverseer: 'Harold Taylor',
    assistantPhone: '7278088547',
    sections: [makeSEC_C_DINING(false), SEC_C_WEST_AUD, SEC_FINAL],
    reminders: REMINDERS
  },
  'sat-d': {
    code: 'sat-d',
    day: 'Saturday, June 13',
    dayShort: 'Sat',
    assignment: 'D',
    congregation: 'South Largo',
    location: 'Largo, FL',
    captain: 'Murillo Pereira',
    captainPhone: '7272229026',
    area: 'Lobbies, Hallways & Men\'s Restroom — Zones 3 & 5',
    assistantOverseer: 'Harold Taylor',
    assistantPhone: '7278088547',
    sections: [SEC_D_LOBBIES, SEC_D_MENS, SEC_FINAL],
    reminders: REMINDERS
  },
  'sat-e': {
    code: 'sat-e',
    day: 'Saturday, June 13',
    dayShort: 'Sat',
    assignment: 'E',
    congregation: 'South New Port Richey',
    location: 'New Port Richey, FL',
    captain: 'Bryan Burford',
    captainPhone: '7279197990',
    area: "Main Women's Restroom — Zone 4",
    assistantOverseer: 'Harold Taylor',
    assistantPhone: '7278088547',
    sections: [SEC_E_WOMENS, SEC_FINAL],
    reminders: REMINDERS
  },
  'sun-a': {
    code: 'sun-a',
    day: 'Sunday, June 14',
    dayShort: 'Sun',
    assignment: 'A',
    congregation: 'South English',
    location: 'Lakeland, FL',
    captain: null,
    captainPhone: null,
    area: 'Zone 2 South — Auditorium Right & Aud. Women\'s Restroom',
    assistantOverseer: 'Pierson Mims',
    assistantPhone: '7274394490',
    isSunday: true,
    sections: [SEC_A_MAIN, SEC_A_RESTROOM, SEC_FINAL],
    reminders: REMINDERS
  },
  'sun-b': {
    code: 'sun-b',
    day: 'Sunday, June 14',
    dayShort: 'Sun',
    assignment: 'B',
    congregation: 'Crescent Heights',
    location: 'St. Petersburg, FL',
    captain: null,
    captainPhone: null,
    area: 'Zone 2 North — Auditorium Left',
    assistantOverseer: 'Pierson Mims',
    assistantPhone: '7274394490',
    isSunday: true,
    sections: [SEC_B_MAIN, SEC_FINAL],
    reminders: REMINDERS
  },
  'sun-c': {
    code: 'sun-c',
    day: 'Sunday, June 14',
    dayShort: 'Sun',
    assignment: 'C',
    congregation: 'South Tampa',
    location: 'Tampa, FL',
    captain: null,
    captainPhone: null,
    area: 'Dining Room & West Auditorium — Zones 6 & 9',
    assistantOverseer: 'Harold Taylor',
    assistantPhone: '7278088547',
    isSunday: true,
    sections: [makeSEC_C_DINING(true), SEC_C_WEST_AUD, SEC_FINAL],
    reminders: REMINDERS
  },
  'sun-d': {
    code: 'sun-d',
    day: 'Sunday, June 14',
    dayShort: 'Sun',
    assignment: 'D',
    congregation: 'Temple Terrace',
    location: 'Temple Terrace, FL',
    captain: null,
    captainPhone: null,
    area: 'Lobbies, Hallways & Men\'s Restroom — Zones 3 & 5',
    assistantOverseer: 'Harold Taylor',
    assistantPhone: '7278088547',
    isSunday: true,
    sections: [SEC_D_LOBBIES, SEC_D_MENS, SEC_FINAL],
    reminders: REMINDERS
  },
  'sun-e': {
    code: 'sun-e',
    day: 'Sunday, June 14',
    dayShort: 'Sun',
    assignment: 'E',
    congregation: 'West English',
    location: 'Lakeland, FL',
    captain: null,
    captainPhone: null,
    area: "Main Women's Restroom — Zone 4",
    assistantOverseer: 'Harold Taylor',
    assistantPhone: '7278088547',
    isSunday: true,
    sections: [SEC_E_WOMENS, SEC_FINAL],
    reminders: REMINDERS
  }
};

module.exports = { ASSIGNMENTS, REMINDERS };
