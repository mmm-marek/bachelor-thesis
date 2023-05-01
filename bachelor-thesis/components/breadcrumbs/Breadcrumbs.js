import Link from "next/link";
import Image from "next/image";
import classNames from "classnames";

import Triangle from "@/assets/components/header/triangle.svg";

const Breadcrumbs = ({ links }) => {
  return (
    <div className="flex w-full mb-20px gap-12px">
      {links.map((link, index) => (
        <div
          className={classNames(
            "flex gap-12px text-18px font-titillium text-theme-blue capitalize",
            index === links.length - 1 ? "pointer-events-none" : ""
          )}
          key={link.id}
        >
          <Link href={link.href}>{link.label}</Link>
          {index !== links.length - 1 && (
            <Image src={Triangle} width={13} height={13} style={{ rotate: "90deg" }} alt="triangle" />
          )}
        </div>
      ))}
    </div>
  );
};

export default Breadcrumbs;
