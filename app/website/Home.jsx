import { useState } from "react";
import {
  Button,
  Typography,
  Card,
  CardBody,
  Chip,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheckIcon,
  CloudArrowUpIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";

export function Home() {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  const features = [
    {
      icon: <ShieldCheckIcon className="h-6 w-6" />, 
      title: "GPS Employee Tracking",
      description: "Monitor field staff locations in real-time to ensure effective on-ground support."
    },
    {
      icon: <CloudArrowUpIcon className="h-6 w-6" />, 
      title: "AI Disease Detection",
      description: "Identify crop diseases early using AI technology for faster solutions."
    },
    {
      icon: <DevicePhoneMobileIcon className="h-6 w-6" />, 
      title: "Farmer Issue Reporting",
      description: "Farmers can report problems directly through the app for immediate assistance."
    }
  ];

  const stats = [
    { value: "95%", label: "Faster Issue Resolution" },
    { value: "24/7", label: "Expert Consultations" },
    { value: "100%", label: "Farmer Satisfaction" }
  ];

  return (
    <div className="min-h-screen bg-[#041f1e]">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Chip
                value="Agro Smart v1.0"
                className="mb-6 bg-gradient-to-r from-[#00b894] to-[#0984e3] shadow-lg"
              />
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
                <span className="text-[#d1fae5] drop-shadow-md">Smart Agro Monitoring</span>
                <br />
                <span className="bg-gradient-to-r from-[#00b894] to-[#0984e3] bg-clip-text text-transparent drop-shadow-sm">
                  & Assistance System
                </span>
              </h1>
              <p className="text-xl text-[#d1fae5]/90 mb-8 leading-relaxed">
                The Smart Agro Monitoring & Assistance System bridges the communication gap between pesticide companies and farmers by offering real-time monitoring, AI-powered disease detection, GPS employee tracking, and direct farmer issue reporting to boost agricultural productivity.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-[#00b894] to-[#0984e3] hover:from-[#00cec9] hover:to-[#74b9ff] shadow-lg hover:shadow-[#00ffcc]/50 transition-all duration-300"
                  onClick={() => navigate('/auth/sign-up')}
                >
                  Get Started Free
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12">
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="text-center p-4 rounded-lg bg-[#041f1e]/50 backdrop-blur-sm border border-[#00b894]/20"
                  >
                    <Typography variant="h4" className="text-[#d1fae5] font-bold drop-shadow-md">
                      {stat.value}
                    </Typography>
                    <Typography className="text-[#d1fae5]/80 font-medium">
                      {stat.label}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#041f1e]/80">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Typography variant="h2" className="text-3xl font-bold mb-4">
              Why Choose Agro Smart?
            </Typography>
            <Typography variant="lead" className="text-gray-600">
              Empower your farming operations with real-time insights and expert solutions.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardBody>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center mb-4">
                      <div className="text-green-600">
                        {feature.icon}
                      </div>
                    </div>
                    <Typography variant="h5" className="mb-2">
                      {feature.title}
                    </Typography>
                    <Typography color="gray">
                      {feature.description}
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
export default Home;
