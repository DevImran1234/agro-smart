import { Typography, Card, CardBody, Button } from "@material-tailwind/react";

export function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-800 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/img/pattern.svg')] opacity-10"></div>
        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl">
            <Typography variant="h1" className="text-5xl font-bold text-white mb-6">
              Smart Agro Monitoring & Assistance System
            </Typography>
            <Typography className="text-xl text-blue-100">
              Bridging the communication gap between pesticide companies and farmers through real-time monitoring, issue reporting, and expert consultations.
            </Typography>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <Typography variant="h3" className="text-3xl font-bold mb-6 text-gray-900">
                Our Mission
              </Typography>
              <Typography className="text-lg text-gray-700 mb-8">
                The Smart Agro Monitoring & Assistance System aims to bridge the communication gap between pesticide companies and farmers by providing a digital platform for real-time monitoring, issue reporting, and expert consultations. The system incorporates GPS-based employee tracking, AI-powered disease detection, and direct farmer issue submissions to enhance agricultural productivity.
              </Typography>
            </div>
            <div className="relative">
              {/* Optional image for the section */}
              <img
                src="https://www.example.com/agro-image.jpg" // Replace with actual image URL
                alt="Agro Smart"
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-blue-500 rounded-lg -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges & Solutions */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <Typography variant="h3" className="text-3xl font-bold mb-12 text-center">
            Addressing Agro Industry Challenges
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {challenges.map((challenge, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardBody>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                    {challenge.icon}
                  </div>
                  <Typography variant="h5" className="mb-4 text-gray-900">
                    {challenge.title}
                  </Typography>
                  <Typography className="text-gray-700 mb-4">
                    {challenge.problem}
                  </Typography>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <Typography variant="h6" className="text-blue-800 mb-2">
                      Our Solution:
                    </Typography>
                    <Typography className="text-blue-700">
                      {challenge.solution}
                    </Typography>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const challenges = [
  {
    icon: <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>,
    title: "Communication Gaps",
    problem: "Lack of direct communication between pesticide companies and farmers",
    solution: "Real-time monitoring and direct issue submission through the platform"
  },
  {
    icon: <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>,
    title: "Disease Detection",
    problem: "Inaccurate or delayed disease detection in crops",
    solution: "AI-powered disease detection system for timely intervention"
  },
  {
    icon: <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>,
    title: "Employee Tracking",
    problem: "Inconsistent tracking of employees working in remote agricultural areas",
    solution: "GPS-based employee tracking for efficient workforce management"
  },
  // Add more challenges if needed...
];

export default About;
