import { isValidUuid } from "@/lib/widget-cors"
import { getPublicWidgetData } from "@/lib/widget-public"
import { ChatWidget } from "@/components/widget/chat-widget"
import { WidgetUnavailable } from "@/components/widget/widget-unavailable"

export default async function WidgetChatPage({
  searchParams,
}: {
  searchParams: Promise<{ agentId?: string; visitorId?: string }>
}) {
  const { agentId, visitorId } = await searchParams

  if (!isValidUuid(agentId)) {
    return <WidgetUnavailable />
  }

  const widget = await getPublicWidgetData(agentId)

  if (!widget) {
    return <WidgetUnavailable />
  }

  return <ChatWidget widget={widget} visitorId={visitorId ?? null} />
}
