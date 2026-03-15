import type { ReactNode } from "react";

interface IProps {
  condition: unknown;
  children: ReactNode;
  else?: ReactNode;
}

export default function If({ condition, children, else: elseNode }: IProps) {
  return Boolean(condition) ? <>{children}</> : <>{elseNode ?? null}</>;
}
