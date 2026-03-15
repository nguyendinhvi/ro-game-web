import Image from "next/image";
import Link from "next/link";

interface IProps {
  href?: string | null;
  showText?: boolean;
  text?: string;
  className?: string;
  imageClassName?: string;
  textClassName?: string;
  priority?: boolean;
}

export default function BrandLogo({
  href = "/",
  showText = true,
  text = "Ro game",
  className = "",
  imageClassName = "",
  textClassName = "",
  priority = false,
}: IProps) {
  const content = (
    <>
      <Image
        src="/images/logo.png"
        alt=""
        width={140}
        height={40}
        className={imageClassName}
        priority={priority}
        aria-hidden
      />
      {showText ? <span className={textClassName}>{text}</span> : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className} aria-label="Về trang chủ">
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}
