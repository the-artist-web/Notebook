/**
 * Node modules
 */
import type { Metadata } from "next";
import Image from "next/image";

/**
 * Components
 */
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription
} from "@/components/ui/empty";

/**
 * Assets
 */
import { Favicon } from "@/assets/images";

/**
 * Constants
 */
import { SETTING_SITE } from "@/constants";

/**
 * Meta tags
 */
export async function generateMetadata(): Promise<Metadata> {
  const siteName = SETTING_SITE.siteName;
  const title = `${siteName} - Your Everyday Notes | Effortless Note-Taking`;
  const description = SETTING_SITE.description;

  return {
    title: {
      absolute: `${siteName} - Your Everyday Notes | Effortless Note-Taking`
    },
    description,
    openGraph: {
      title,
      description
    },
    twitter: {
      title,
      description
    },
  };
}

const page = async () => {
  const siteName = SETTING_SITE.siteName;

  return (
    <Empty>
      <Image
        src={Favicon.src}
        alt={siteName}
        width={Favicon.width}
        height={Favicon.height}
        className="w-full h-full object-contain max-h-[68px]"
      />

      <EmptyHeader>
        <EmptyTitle className="text-2xl font-bold tracking-wide lowercase !text-foreground">{siteName}</EmptyTitle>

        <EmptyDescription>Streamline your daily note-taking with Notekeeper. Organize, access, and enhance productivity with ease. Your go-to platform for managing your everyday notes.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export default page