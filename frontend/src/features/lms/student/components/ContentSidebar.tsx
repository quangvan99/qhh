'use client'

import { useRouter } from 'next/navigation'
import {
  BookOpen, Video, FileText, Download, ClipboardList, MapPin,
  Check, Lock,
} from 'lucide-react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { cn } from '@/lib/utils'
import type { StudentContentGroup, StudentContentItem } from '../types/student.types'

const typeIcons: Record<StudentContentItem['type'], React.ReactNode> = {
  scorm: <BookOpen className="h-4 w-4" />,
  video: <Video className="h-4 w-4" />,
  text: <FileText className="h-4 w-4" />,
  file: <Download className="h-4 w-4" />,
  survey: <ClipboardList className="h-4 w-4" />,
  offline: <MapPin className="h-4 w-4" />,
}

interface ContentSidebarProps {
  classId: string
  groups: StudentContentGroup[]
  activeItemId?: string
}

export function ContentSidebar({ classId, groups, activeItemId }: ContentSidebarProps) {
  const router = useRouter()

  const handleItemClick = (item: StudentContentItem, groupId: string) => {
    if (item.locked) return
    router.push(`/my-classes/${classId}/content/${groupId}/${item.id}`)
  }

  return (
    <Accordion defaultValue={groups.map((g) => g.id)}>
      {groups.map((group) => (
        <AccordionItem key={group.id} value={group.id}>
          <AccordionTrigger className="text-sm font-medium px-2">
            <span className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-600" />
              {group.name}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-0.5 pl-2">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item, group.id)}
                  disabled={item.locked}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors text-left',
                    item.locked
                      ? 'cursor-not-allowed opacity-50'
                      : 'cursor-pointer hover:bg-muted',
                    activeItemId === item.id && 'bg-emerald-50 text-emerald-700 font-medium'
                  )}
                >
                  <span className="shrink-0 text-muted-foreground">
                    {item.locked ? <Lock className="h-4 w-4" /> : typeIcons[item.type]}
                  </span>
                  <span className="flex-1 truncate">{item.title}</span>
                  {item.completed && (
                    <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                  )}
                  {item.current && !item.completed && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                  )}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
