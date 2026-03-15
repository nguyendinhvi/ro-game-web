import type { ReactNode } from "react";

interface MatchCase {
  condition: boolean;
  render: ReactNode;
}

interface IProps {
  cases: MatchCase[];
  default?: ReactNode;
}

export default function MatchRender({
  cases,
  default: defaultRender,
}: IProps) {
  for (const matchCase of cases) {
    if (matchCase.condition) {
      return <>{matchCase.render}</>;
    }
  }

  return defaultRender ? <>{defaultRender}</> : null;
}
