/* ==========================================================================
   THE ACCOUNTS AND CONTACTS BEHIND EACH SAVED LIST.

   A saved list in src/data/savedLists.js only records how many accounts
   and contacts it holds. When you start a campaign from one, the Accounts
   and Contacts pickers need the actual people, so they are generated from
   the word lists below, to exactly the list's counts: TX Manufacturing
   under 500 gets 214 accounts and 598 contacts.

   !! ALL FICTIONAL !!
   Unlike the 12 companies on Company Search, these company names are made
   up, and so are the people. Any match with a real company or person is a
   coincidence.

   The same list always generates the same accounts and people, so a demo
   looks identical every time. Changing a word below changes the names that
   come out, which is fine.

   Lists saved from Company Search skip all this: they keep the real
   companies and contacts that were on screen.

   TO CHANGE WHAT A LIST IS MADE OF: edit LIST_INDUSTRIES. Each saved list
   id maps to the industries its accounts are drawn from. A list not named
   there uses DEFAULT_INDUSTRIES.
   ========================================================================== */

/* Which industries each saved list's accounts come from. Keys are the ids in
   src/data/savedLists.js; values are keys of INDUSTRIES below. */
export const LIST_INDUSTRIES = {
  'tx-manufacturing-under-500': ['machinery', 'fabrication', 'electrical'],
  'legacy-ecc-healthcare': ['healthcare'],
  'ohio-food-beverage': ['food'],
  'clean-core-chemicals': ['chemicals'],
}

export const DEFAULT_INDUSTRIES = [
  'machinery',
  'fabrication',
  'electrical',
  'distribution',
  'consumer',
  'chemicals',
  'food',
  'healthcare',
]

/* Each industry: the label shown in the picker, and the words used to end
   a company name in it. */
export const INDUSTRIES = {
  machinery: {
    label: 'Industrial Machinery',
    endings: ['Machine Works', 'Precision Parts', 'Industrial', 'Tooling', 'Equipment', 'Hydraulics'],
  },
  fabrication: {
    label: 'Metal Fabrication',
    endings: ['Fabrication', 'Steel Works', 'Metalcraft', 'Welding', 'Forge'],
  },
  electrical: {
    label: 'Electrical Equipment',
    endings: ['Electric', 'Controls', 'Power Systems', 'Components', 'Motors'],
  },
  distribution: {
    label: 'Wholesale Distribution',
    endings: ['Supply', 'Distribution', 'Logistics', 'Trading'],
  },
  consumer: {
    label: 'Consumer Products',
    endings: ['Brands', 'Home Goods', 'Consumer Products', 'Outfitters'],
  },
  chemicals: {
    label: 'Specialty Chemicals',
    endings: ['Chemical', 'Coatings', 'Polymers', 'Resins', 'Adhesives'],
  },
  food: {
    label: 'Food and Beverage',
    endings: ['Foods', 'Provisions', 'Beverage Co.', 'Dairy', 'Bakeries', 'Farms'],
  },
  healthcare: {
    label: 'Hospitals and Health Systems',
    endings: ['Health System', 'Medical Group', 'Health Partners', 'Regional Medical', 'Care Network'],
  },
}

/* The first word of a company name. */
export const NAME_STARTS = [
  'Brazos', 'Lone Star', 'Gulf Coast', 'Trinity', 'Pecos', 'Hill Country',
  'Summit', 'Cedar Ridge', 'Northfield', 'Keystone', 'Riverbend', 'Ironwood',
  'Bluestem', 'Harbor', 'Prairie', 'Granite', 'Silver Creek', 'Oak Valley',
  'Lakeshore', 'Redstone', 'Meridian', 'Pinnacle', 'Heartland', 'Crossroads',
  'Blackhawk', 'Sterling', 'Fairview', 'Westbrook', 'Maple Grove', 'Canyon',
  'Frontier', 'Horizon', 'Eastgate', 'Stonebridge', 'Clearwater', 'Highland',
  'Bayside', 'Copperleaf', 'Juniper', 'Sycamore', 'Evergreen', 'Anchor',
  'Beacon', 'Tri-County', 'Allied', 'Pioneer', 'Cardinal', 'Midway',
]

/* Sometimes added after the name. Blank entries mean "nothing added". */
export const NAME_FORMS = ['', '', '', '', 'Inc.', 'Group', 'Co.', 'Holdings', 'LLC']

/* The buying committee: the titles a contact can have. The first few are
   the senior ones each account starts with; the rest fill in behind. */
export const SENIOR_TITLES = [
  'Chief Information Officer',
  'Chief Financial Officer',
  'Chief Operating Officer',
  'VP of Information Technology',
]

export const COMMITTEE_TITLES = [
  'IT Director',
  'Director of Business Applications',
  'Enterprise Architect',
  'Head of Digital Transformation',
  'VP of Finance',
  'Corporate Controller',
  'VP of Operations',
  'Director of Supply Chain',
  'Procurement Manager',
  'Business Systems Manager',
  'Director of IT Infrastructure',
  'Head of Data and Analytics',
  'Program Manager, Business Transformation',
]

export const FIRST_NAMES = [
  'Aisha', 'Alejandro', 'Amara', 'Andrew', 'Anita', 'Ben', 'Carla', 'Chen',
  'Daniel', 'Deepa', 'Diego', 'Elif', 'Emily', 'Farah', 'Gareth', 'Grace',
  'Hiro', 'Imani', 'Isaac', 'Jana', 'Jamal', 'Julia', 'Kai', 'Kavya',
  'Laura', 'Liam', 'Lucia', 'Marco', 'Maya', 'Mei', 'Nadia', 'Nathan',
  'Noor', 'Omar', 'Paula', 'Rahul', 'Rebecca', 'Rosa', 'Sam', 'Sana',
  'Sofia', 'Stefan', 'Tariq', 'Tessa', 'Tomasz', 'Uma', 'Victor', 'Wen',
  'Yusuf', 'Zoe',
]

export const LAST_NAMES = [
  'Adeyemi', 'Alvarez', 'Anderson', 'Bauer', 'Becker', 'Bennett', 'Brooks',
  'Castillo', 'Chen', 'Coleman', 'Das', 'Delgado', 'Dubois', 'Edwards',
  'Fischer', 'Foster', 'Garcia', 'Gupta', 'Hansen', 'Hughes', 'Ibrahim',
  'Jensen', 'Kaur', 'Kim', 'Kowalski', 'Larsen', 'Lee', 'Lopez', 'Mahmoud',
  'Martin', 'Mendoza', 'Morales', 'Murphy', 'Nakamura', 'Nguyen', 'Novak',
  'Okafor', 'Olsen', 'Ortiz', 'Park', 'Patel', 'Petrov', 'Quinn', 'Ramos',
  'Reyes', 'Rossi', 'Santos', 'Schmidt', 'Shah', 'Silva', 'Singh', 'Sullivan',
  'Tanaka', 'Thompson', 'Torres', 'Vargas', 'Walker', 'Wright', 'Yamamoto',
  'Zhang',
]

/* Most contacts one generated account can have. */
export const MAX_CONTACTS_PER_ACCOUNT = 7
