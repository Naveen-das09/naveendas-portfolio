import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { QubitMark } from "@/components/icons/BrandIcons";

const PHOTO_FILENAME = "naveen-photo.jpg";

export function ProfilePhoto() {
  const exists = fs.existsSync(path.join(process.cwd(), "public", PHOTO_FILENAME));

  return (
    <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-full border border-border-strong bg-surface-raised md:h-48 md:w-48">
      {exists ? (
        <Image
          src={`/${PHOTO_FILENAME}`}
          alt="Naveen S Das"
          fill
          sizes="192px"
          className="object-cover"
          priority
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface-raised to-surface">
          <QubitMark className="h-16 w-16 text-cyan/60" />
        </div>
      )}
    </div>
  );
}
