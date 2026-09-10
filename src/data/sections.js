/* ==========================================================================
   SETTINGS: one page, with its own list of sections down the left.

   The sidebar has a single "Settings" link. Clicking it opens the Settings
   page and switches the whole left sidebar over to the settings list:
   General, Tenant, Vendor, Customer and Workspace. Picking one swaps the
   panel on the right. A back chevron at the top of the sidebar returns it to
   the normal menu and takes you back to where you were.

   Most sections show their options as a grid of cards. Clicking a card opens
   that option's own page, at the same address it has always had, for example
   /tenant/users or /vendor/vendor-profile.

   This file holds two lists:

   SECTIONS      the cards. Each group of cards keeps its original id, which
                 is also the first part of every card's address.
   SETTINGS_NAV  the column on the Settings page, in the order it appears.

   TO ADD AN OPTION: add a card to the right group in SECTIONS. The grid, the
   card's page, its address, the breadcrumbs and the settings search all
   follow from this file, so there is nothing else to edit.

   SECTIONS fields:
     id          the group slug, and the start of each card's address
     label, icon the group's own name and icon. The Settings page shows the
                 name and icon from SETTINGS_NAV below instead.
     description sits under the section title on the Settings page
     cards[]     id (URL slug), label, icon, description
   ========================================================================== */

export const SECTIONS = [
  {
    id: 'settings',
    label: 'Settings',
    icon: 'settings',
    description: 'Workspace-wide configuration and connected systems.',
    cards: [
      {
        id: 'emails',
        label: 'Emails',
        icon: 'mail',
        description:
          'Sending domains, signatures and the templates used for outbound.',
      },
      {
        id: 'communications',
        label: 'Communications',
        icon: 'chat',
        description:
          'Notification rules, digests and which events reach your inbox.',
      },
      {
        id: 'zoho-crm',
        label: 'Zoho CRM',
        icon: 'plug',
        description:
          'Connect Zoho and choose which fields sync in each direction.',
      },
      {
        id: 'hubspot-crm',
        label: 'HubSpot CRM',
        icon: 'plug',
        description:
          'Connect HubSpot and choose which fields sync in each direction.',
      },
      {
        id: 'territory-mapping',
        label: 'Territory Mapping',
        icon: 'map',
        description:
          'Assign accounts to territories and the reps who own them.',
      },
    ],
  },
  {
    id: 'tenant',
    label: 'Tenant',
    icon: 'box',
    description: 'Everything scoped to this tenant and the people inside it.',
    cards: [
      {
        id: 'workspaces',
        label: 'Workspaces',
        icon: 'grid',
        description: 'Create workspaces and control who can see each one.',
      },
      {
        id: 'users',
        label: 'Users',
        icon: 'users',
        description: 'Invite people, set roles and revoke access.',
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: 'settings',
        description:
          'Tenant name, region, data retention and authentication policy.',
      },
      {
        id: 'announcements',
        label: 'Announcements',
        icon: 'megaphone',
        description: 'Post a banner every user in the tenant will see.',
      },
    ],
  },
  {
    id: 'vendor',
    label: 'Vendor',
    icon: 'building',
    description: 'Your vendor record and the requests you respond to.',
    cards: [
      {
        id: 'vendor-profile',
        label: 'Vendor Profile',
        icon: 'building',
        description:
          'What you do and who you sell to. This is what your account list is built from.',
      },
      {
        id: 'rfqs',
        label: 'RFQs',
        icon: 'file',
        description: 'Requests for quote you have received, with their status.',
      },
      {
        id: 'rfps',
        label: 'RFPs',
        icon: 'file',
        description: 'Requests for proposal you have received, with due dates.',
      },
    ],
  },
  {
    id: 'customer',
    label: 'Customer',
    icon: 'users',
    description: 'Requests you have issued to vendors.',
    cards: [
      {
        id: 'rfqs',
        label: 'RFQs',
        icon: 'file',
        description: 'Requests for quote you have issued, and who responded.',
      },
      {
        id: 'rfps',
        label: 'RFPs',
        icon: 'file',
        description: 'Requests for proposal you have issued, and their stage.',
      },
    ],
  },
]

/* ==========================================================================
   SETTINGS_NAV: the column down the left of the Settings page.

   Fields:
     id          the section slug
     label       what the column, the page title and the breadcrumb call it
     icon        icon name (see src/components/Icon.jsx)
     path        its address. Each one can be linked to directly.
     section     which group in SECTIONS supplies its cards and description.
                 General shows the cards that used to sit on the old Settings
                 landing page. null means it has no cards yet.
     legacyPath  where this section used to live before Settings became one
                 page. That old address still works and forwards here.
     empty       for a section with no cards: the placeholder it shows.
   ========================================================================== */

export const SETTINGS_NAV = [
  {
    id: 'general',
    label: 'General',
    icon: 'settings',
    path: '/settings',
    section: 'settings',
  },
  {
    id: 'tenant',
    label: 'Tenant',
    icon: 'box',
    path: '/settings/tenant',
    section: 'tenant',
    legacyPath: '/tenant',
  },
  {
    id: 'vendor',
    label: 'Vendor',
    icon: 'building',
    path: '/settings/vendor',
    section: 'vendor',
    legacyPath: '/vendor',
  },
  {
    id: 'customer',
    label: 'Customer',
    icon: 'users',
    path: '/settings/customer',
    section: 'customer',
    legacyPath: '/customer',
  },
  {
    id: 'workspace',
    label: 'Workspace',
    icon: 'grid',
    path: '/settings/workspace',
    section: null,
    legacyPath: '/admin/workspace',
    empty: {
      title: 'Not built yet',
      body: 'The brief for this screen has not been written. Replace this file when it is.',
    },
  },
]

/* The start of every breadcrumb in Settings: Admin > Settings > Section. */
export const SETTINGS_BREADCRUMB = {
  root: 'Admin',
  label: 'Settings',
}

/* The top of the left sidebar while you are in Settings. `back` is what a
   screen reader announces for the chevron. */
export const SETTINGS_SIDEBAR_COPY = {
  title: 'Settings',
  back: 'Leave settings',
}

/* The search box in the top bar, while you are anywhere in Settings. */
export const SETTINGS_SEARCH_COPY = {
  placeholder: 'Search settings…',
  noMatch: 'No settings match',
  sectionHint: 'Section',
}

export function getSection(id) {
  return SECTIONS.find((s) => s.id === id)
}

export function getCard(sectionId, cardId) {
  return getSection(sectionId)?.cards.find((c) => c.id === cardId)
}
