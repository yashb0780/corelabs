/**
 * A row of the campaign action pills. `actions` lists which to show by id
 * (see LIST_ACTIONS in src/data/campaigns.js), in their fixed order;
 * `onPick(id)` is called with the one clicked. `chat` uses the wording
 * for under an assistant reply, e.g. "Start a campaign from this list".
 */
import { cx } from '../cx'
import { ActionPill } from '../ui'
import { LIST_ACTIONS } from '../../data/campaigns'

export function ActionPills({ actions, onPick, chat = false, className }) {
  return (
    <div className={cx('flex flex-wrap items-center gap-1.5', className)}>
      {LIST_ACTIONS.filter((a) => actions.includes(a.id)).map((a) => (
        <ActionPill key={a.id} icon={a.icon} onClick={() => onPick(a.id)}>
          {(chat && a.chatLabel) || a.label}
        </ActionPill>
      ))}
    </div>
  )
}
