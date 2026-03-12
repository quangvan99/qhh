import { redirect } from 'next/navigation'

// SCR-02-008: Sessions tab is on the same page as levels
// Redirect to levels page with sessions tab
export default function ScholarshipSessionsPage() {
  redirect('/gddt/scholarship/levels?tab=sessions')
}
