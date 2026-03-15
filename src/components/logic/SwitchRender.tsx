import { Suspense, isValidElement, type ReactNode } from "react";

interface IProps<SWType extends string> {
  sw: SWType;
  render?: Partial<Record<SWType, ReactNode>>;
  fallback?: ReactNode;
}

export default function SwitchRender<SWType extends string>({
  sw,
  render,
  fallback = <></>,
}: IProps<SWType>) {
  const selectedContent = render?.[sw as keyof typeof render] ?? null;

  return (
    <Suspense fallback={fallback}>
      {isValidElement(selectedContent) && selectedContent}
    </Suspense>
  );
}
