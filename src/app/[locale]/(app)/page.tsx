/**
 * Node modules
 */
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";

/**
 * Actions
 */
import { getNotebooksAction } from "@/actions/notebooks/getNotebooks";
import { getUser } from "@/actions/auth/getUser";

/**
 * Components
 */
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

/**
 * Assets
 */
import { StickyNotesIcon } from "lucide-react";

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
  await connection();
  
  const user = await getUser();
  const notebooks = await getNotebooksAction();
  
  if (user.ok)
    if (notebooks.ok && notebooks.data.length > 0) redirect(`/notebook/${notebooks.data[0].id}`);

  return (
    <Empty>
      <EmptyHeader>
        <StickyNotesIcon size={68} className="opacity-25" />

        <EmptyTitle className="text-2xl font-normal">No Notes</EmptyTitle>
      </EmptyHeader>
    </Empty>
  );
}

export default page