export default function Home() {
  return (
    <div>

      {/* CLASSROOM REMINDER SECTION */}
      <div className="flex gap-6">

        {/* Purple gradient card */}
        <div className="w-[550px] h-[180px] rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 p-6 text-white shadow">
          <h2 className="text-xl font-semibold">Classroom reminder</h2>
          <p className="mt-3">“There is a DE quiz in this week….”</p>

          <div className="flex gap-2 mt-8">
            <div className="w-2 h-2 rounded-full bg-white opacity-80"></div>
            <div className="w-2 h-2 rounded-full bg-white opacity-40"></div>
            <div className="w-2 h-2 rounded-full bg-white opacity-40"></div>
            <div className="w-2 h-2 rounded-full bg-white opacity-40"></div>
          </div>
        </div>

        {/* SCHEDULE CARD */}
        <div className="flex-1 h-[180px] border rounded-xl">
          <div className="h-full w-full flex">
            <div className="w-24 bg-gradient-to-b from-red-500 to-purple-600 text-white flex items-center justify-center text-lg font-semibold">
              Schedule
            </div>
            <div className="flex-1 p-4">
              <p className="text-gray-600">Upload your schedule</p>
              {/* schedule grid screenshot not included */}
            </div>
          </div>
        </div>

      </div>

      {/* GOOD MORNING SECTION */}
      <h2 className="text-2xl font-bold my-8">Good Morning</h2>

      <h3 className="text-lg font-medium mb-3">Finished</h3>

      <div className="grid grid-cols-5 gap-6 opacity-40">
        {/* Empty placeholders (same as figma) */}
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="h-[180px] bg-white rounded-xl shadow"></div>
        ))}
      </div>

      <h3 className="text-lg font-medium mt-10 mb-3">Recent Review</h3>

      <div className="grid grid-cols-5 gap-6 opacity-40">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="h-[180px] bg-white rounded-xl shadow"></div>
        ))}
      </div>

    </div>
  );
}
