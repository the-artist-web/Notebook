/**
 * Node modules
 */
import type { Metadata } from "next";

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

const page = () => {
  return (
    <div>page</div>
  )
}

export default page