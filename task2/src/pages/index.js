import UploadForm from "../components/UploadForm";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Transaction Report Upload</h1>
      <UploadForm />
    </div>
  );
}
