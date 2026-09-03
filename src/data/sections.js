/* ==========================================================================
   THE FOUR CARD SECTIONS: Settings, Tenant, Vendor, Customer.

   Each of these is a plain sidebar link. Clicking it opens a landing page in
   the main content area showing that section's options as a grid of cards.
   Clicking a card opens that option's own page, with a breadcrumb back up.

   Deliberately NOT sidebar dropdowns: no chevrons, no accordions, no nested
   indented items. Crowding the sidebar is the thing this pattern avoids.

   TO ADD AN OPTION: add a card to the section below. The landing page grid,
   the routes and the breadcrumbs all follow from this file, so there is
   nothing else to edit.

   Fields:
     id          the section slug, and its URL: /settings, /tenant, ...
     label       what the sidebar and the breadcrumb call it
     icon        sidebar icon name (see src/components/Icon.jsx)
     root        first crumb in the breadcrumb, above the section
     description sits under the landing page title
     cards[]     id (URL slug), label, icon, description
   ========================================================================== */

export const SECTIONS = [
  {
    id: 'settings',
    label: 'Settings',
    icon: 'settings',
    root: 'Admin',
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
    root: 'Admin',
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
    root: 'Admin',
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
    root: 'Admin',
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

export function getSection(id) {
  return SECTIONS.find((s) => s.id === id)
}

export function getCard(sectionId, cardId) {
  return getSection(sectionId)?.cards.find((c) => c.id === cardId)
}
