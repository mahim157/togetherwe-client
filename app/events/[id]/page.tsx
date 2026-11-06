
import { Suspense } from "react";
import EventDetailsClient from "./EventDetailsClient";

type PageProps = {
  params: Promise<{ id: string }>;
};

async function EventDetailsContent({ params }: PageProps) {
  const { id } = await params;

  return <EventDetailsClient id={id} />;
}

export default function EventDetailsPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <p className="text-gray-600">Loading event details...</p>
        </div>
      }
    >
      <EventDetailsContent params={params} />
    </Suspense>
  );
}
