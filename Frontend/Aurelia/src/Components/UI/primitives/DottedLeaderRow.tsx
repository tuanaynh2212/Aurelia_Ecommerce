import type { ReactNode } from "react";
import { ReceiptRow, type ReceiptRowProps } from "./Receipt";

export interface DottedLeaderRowProps extends ReceiptRowProps {
  label: ReactNode;
  value: ReactNode;
}

/**
 * Dotted-leader key/value row (`LABEL ...... VALUE`) for receipts, passes, and manifests.
 */
export function DottedLeaderRow(props: DottedLeaderRowProps) {
  return <ReceiptRow {...props} />;
}

export default DottedLeaderRow;

