import {
  SegmentMeter as BaseSegmentMeter,
  type SegmentMeterProps as BaseSegmentMeterProps,
} from "./Meter";

export interface SegmentMeterProps extends BaseSegmentMeterProps {
  /** Optional max value when `value` is passed as an unnormalized number (e.g. 0..100). */
  max?: number;
}

/**
 * Segmented hardware level meter supporting both normalized `0..1` and `value` / `max` props.
 */
export function SegmentMeter({
  value,
  max,
  ...rest
}: SegmentMeterProps) {
  const normalized =
    typeof max === "number" && max > 0
      ? value / max
      : value > 1
        ? value / 100
        : value;
  return <BaseSegmentMeter value={normalized} {...rest} />;
}

export default SegmentMeter;

