import { RequestForm } from "@/components/features/requests/RequestForm";

export default function CreatePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center mono-border-b pb-4">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-wide">
            Create New Request
          </h2>
          <p className="text-xs uppercase text-gray-500 mt-1">
            Convert email/request into tracked Request ID
          </p>
        </div>
      </div>
      <RequestForm />
    </div>
  );
}
