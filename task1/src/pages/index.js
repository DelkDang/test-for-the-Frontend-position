import FileUploadForm from "../components/FileUploadForm";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Transaction Report Upload</h1>
      <FileUploadForm />
    </div>
  );
}
