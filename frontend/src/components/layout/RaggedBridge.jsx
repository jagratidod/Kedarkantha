import { RAGGED_H } from '../../lib/raggedEdge'

/**
 * White band that continues the journey map section above it. The next section is pulled up over it
 * by RAGGED_H and has a ragged, treeline-shaped top edge, so the two sections meet along a torn edge.
 * Plain flow layout: nothing is pinned, animated or scroll-linked.
 */
export default function RaggedBridge() {
  return <div className="bg-white" style={{ height: RAGGED_H }} aria-hidden="true" />
}
