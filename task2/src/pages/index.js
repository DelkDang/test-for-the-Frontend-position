import Link from "next/link";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">
        Chào mừng đến với cửa hàng bán xăng
      </h1>
      <Link href="/gasStationTransaction">Nhập giao dịch bán xăng</Link>
    </div>
  );
};

export default Home;
