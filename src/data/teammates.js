/* ==========================================================================
   TEAMMATES: the people in this workspace.

   Dummy people for the prototype. Names are fictional. They appear as the
   "Created By" and "Assigned To" on Saved lists, and in the Assign picker.

   TO ADD A PERSON: copy one entry and change it. The id is how other data
   files point at a person, so keep it unique and never reuse an old one.

   Fields:
     id     unique slug, referred to from other data files
     name   full name, shown everywhere. Initials are drawn from it.
     role   the line under their name in the Assign picker
     tone   the colour of their avatar circle: grey, blue, amber, green or
            teal. These come from the tone palette in src/styles/tokens.css.
   ========================================================================== */

export const TEAMMATES = [
  {
    id: 'priya-raman',
    name: 'Priya Raman',
    role: 'Account Executive · Central',
    tone: 'blue',
  },
  {
    id: 'marcus-webb',
    name: 'Marcus Webb',
    role: 'Sales Director',
    tone: 'green',
  },
  {
    id: 'elena-sokolova',
    name: 'Elena Sokolova',
    role: 'SDR · Healthcare',
    tone: 'teal',
  },
  {
    id: 'dev-malhotra',
    name: 'Dev Malhotra',
    role: 'Solution Architect',
    tone: 'amber',
  },
  {
    id: 'hannah-cho',
    name: 'Hannah Cho',
    role: 'SDR · Manufacturing',
    tone: 'grey',
  },
  {
    id: 'tomas-alvarez',
    name: 'Tomás Alvarez',
    role: 'Account Executive · West',
    tone: 'blue',
  },
  {
    id: 'aisha-bello',
    name: 'Aisha Bello',
    role: 'Partner Manager',
    tone: 'green',
  },
  {
    id: 'jordan-reyes',
    name: 'Jordan Reyes',
    role: 'Marketing Operations',
    tone: 'teal',
  },
  {
    id: 'sam-okafor',
    name: 'Sam Okafor',
    role: 'Revenue Operations Lead',
    tone: 'amber',
  },
]

export function getTeammate(id) {
  return TEAMMATES.find((t) => t.id === id)
}
