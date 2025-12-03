// src/pages/AboutPage.jsx
export default function AboutPage() {
  const team = [
    { name: "Ken", role: "UI/UX Designer", initial: "K" },
    { name: "Kate", role: "Backend Developer", initial: "K" },
    { name: "Reighnard", role: "Frontend Developer", initial: "R" },
    { name: "Hazel", role: "Fullstack Developer", initial: "H" },
  ];

  return (
    <div className="p-8 lg:p-16 w-full min-h-screen bg-gradient-to-br from-white to-orange-50">
      
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          About <span className="text-orange-500">UniHub</span>
        </h1>

        <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
          <strong>UniHub</strong> is a next-generation digital study companion 
          built for modern students. Our platform unifies your notes, 
          productivity, schedule alerts, and AI-powered tools into one elegant workspace.
        </p>
      </div>

      {/* Features Section */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 border border-gray-100 mb-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">What UniHub Offers</h2>

        <ul className="space-y-4 text-gray-700 text-lg">
          <li className="flex items-start gap-3">
            <span className="text-orange-500 text-xl">•</span>
            AI-powered note summarization
          </li>

          <li className="flex items-start gap-3">
            <span className="text-orange-500 text-xl">•</span>
            Study streak & productivity tracking
          </li>

          <li className="flex items-start gap-3">
            <span className="text-orange-500 text-xl">•</span>
            Intelligent schedule & classroom reminders
          </li>

          <li className="flex items-start gap-3">
            <span className="text-orange-500 text-xl">•</span>
            Organized and fast access to all your notes
          </li>

          <li className="flex items-start gap-3">
            <span className="text-orange-500 text-xl">•</span>
            Beautiful UX designed for efficient studying
          </li>
        </ul>
      </div>

      {/* Team Section */}
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10">Meet the Team</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member) => (
            <div
              key={member.name}
              className="group bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              {/* Avatar */}
              <div className="w-20 h-20 mx-auto rounded-full bg-orange-100 text-orange-600 
                              flex items-center justify-center text-3xl font-bold mb-4">
                {member.initial}
              </div>

              {/* Text */}
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-500 transition">
                {member.name}
              </h3>
              <p className="text-gray-500 mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
