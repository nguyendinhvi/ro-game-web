import type { ReactNode } from "react";

interface IProps {
  condition: unknown;
  true: ReactNode;
  false: ReactNode;
}

export default function Or({
  condition,
  true: whenTrue,
  false: whenFalse,
}: IProps) {
  return Boolean(condition) ? <>{whenTrue}</> : <>{whenFalse}</>;
}
