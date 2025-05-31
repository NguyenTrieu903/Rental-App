export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Color Test Page</h1>

      <div className="grid grid-cols-1 gap-4">
        <div className="p-4 bg-[#27272a] text-white">bg-primary-700</div>
        <div className="p-4 bg-white text-[#27272a]">text-primary-700</div>
        <div className="p-4 bg-[#eb8686] text-white">bg-secondary-500</div>
        <div className="p-4 bg-white text-[#eb8686]">text-secondary-500</div>
      </div>
    </div>
  );
}
