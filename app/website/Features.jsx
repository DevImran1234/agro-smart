import React, { useState } from "react"
import { Card, CardBody, Typography, Button, Input, Select, Option, Textarea } from "@material-tailwind/react"
import {
  MdOutlineHealthAndSafety,
  MdBugReport,
  MdScience,
  MdTrendingUp,
  MdCloud,
  MdSecurity,
  MdPerson,
  MdCheck,
  MdLocationOn,
} from "react-icons/md"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";


const HealthBarChart = ({ data }) => (
  <BarChart width={500} height={300} data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="value" fill="#40916C" />
  </BarChart>
);

const PestPieChart = ({ data }) => (
  <PieChart width={400} height={400}>
    <Pie
      data={data}
      cx="50%"
      cy="50%"
      labelLine={false}
      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
      outerRadius={80}
      fill="#8884d8"
      dataKey="value"
    >
      {data.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={["#0088FE", "#00C49F", "#FFBB28", "#FF8042"][index % 4]} />
      ))}
    </Pie>
    <Tooltip />
  </PieChart>
);

// Add this CSS to your global styles or component
const cardStyles = `
  .feature-card {
    transition: all 0.3s ease-in-out;
  }

  .feature-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }

  .feature-card:hover .icon-wrapper {
    transform: scale(1.1);
    background-color: rgba(64, 145, 108, 0.2);
  }

  .feature-card:hover .feature-title {
    color: #2D6A4F;
  }

  .stat-card {
    overflow: hidden;
    position: relative;
  }

  .stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, transparent, rgba(64, 145, 108, 0.1), transparent);
    transform: translateX(-100%);
    transition: 0.5s;
  }

  .stat-card:hover::before {
    transform: translateX(100%);
  }
`

export function Features() {
  const [formStep, setFormStep] = useState(1)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    farmerName: "",
    location: "",
    cropType: "",
    farmSize: "",
    growthStage: "",
    leafColor: "",
    weather: "",
    fertilizer: "",
    pestSigns: "",
    damageType: "",
    pesticide: "",
    soilType: "",
    moisture: "",
    phLevel: "",
    fertilizerType: "",
    soilDescription: "",
  })
  const [analysisResult, setAnalysisResult] = useState(null) // Add state for analysis result
  const [graphData, setGraphData] = useState({
    healthData: [],
    pestData: [],
  });
  const validateStep = (step) => {
    const newErrors = {}

    switch (step) {
      case 1:
        if (!formData.farmerName.trim()) {
          newErrors.farmerName = "Farmer name is required"
        }
        if (!formData.location.trim()) {
          newErrors.location = "Location is required"
        }
        if (!formData.cropType) {
          newErrors.cropType = "Please select a crop type"
        }
        if (!formData.farmSize) {
          newErrors.farmSize = "Farm size is required"
        } else if (isNaN(formData.farmSize) || formData.farmSize <= 0) {
          newErrors.farmSize = "Please enter a valid farm size"
        }
        break

      case 2:
        if (!formData.growthStage) {
          newErrors.growthStage = "Please select growth stage"
        }
        if (!formData.leafColor) {
          newErrors.leafColor = "Please select leaf color"
        }
        if (!formData.weather) {
          newErrors.weather = "Please select weather condition"
        }
        if (!formData.fertilizer) {
          newErrors.fertilizer = "Please select fertilizer usage"
        }
        break

      case 3:
        if (!formData.pestSigns) {
          newErrors.pestSigns = "Please indicate pest signs"
        }
        if (formData.pestSigns === "yes" && !formData.damageType) {
          newErrors.damageType = "Please select damage type"
        }
        if (!formData.pesticide) {
          newErrors.pesticide = "Please select pesticide type"
        }
        break

      case 4:
        if (!formData.soilType) {
          newErrors.soilType = "Please select soil type"
        }
        if (!formData.moisture) {
          newErrors.moisture = "Please select moisture level"
        }
        if (formData.phLevel && (formData.phLevel < 0 || formData.phLevel > 14)) {
          newErrors.phLevel = "pH level must be between 0 and 14"
        }
        if (!formData.fertilizerType) {
          newErrors.fertilizerType = "Please select fertilizer type"
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing/selecting
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleNext = () => {
    if (validateStep(formStep)) {
      setFormStep(formStep + 1)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateStep(formStep)) {
      try {
        console.log("Form submitted:", formData);
        const prompt = `Analyze the following farm details and provide 
        - The health condition of the fields  
        - Recommendations for improvement  

        Farm Details: ${JSON.stringify(formData)}`;
        const apiKey = "AIzaSyBAybb0PjfeqmmpkiH2jmi4HTGWiTVHCP4";
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: prompt,
                    },
                  ],
                },
              ],
              generationConfig: {
                maxOutputTokens: 200,
              },
            }),
          }
        );

        const result = await response.json();
        const aiResponse = result?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";

        const healthData = [
          { name: "Crop Health", value: aiResponse.includes("poor") ? 30 : 80 },
          { name: "Soil Quality", value: 70 },
          { name: "Pest Risk", value: aiResponse.includes("pest") ? 50 : 20 },
        ];

        const pestData = [
          { name: "Pest Detected", value: aiResponse.includes("pest") ? 40 : 10 },
          { name: "No Pest", value: aiResponse.includes("pest") ? 60 : 90 },
        ];

        setGraphData({ healthData, pestData });

        const simulatedResult = {
          healthCondition: aiResponse.includes("poor") ? "Poor" : "Good",
          recommendations: aiResponse.split("\n").slice(1),
        };
        setAnalysisResult(simulatedResult);

        alert("Form submitted successfully!");
      } catch (error) {
        console.error("Submission error:", error);
        alert("Error submitting form. Please try again.");
      }
    }
  };

  const renderError = (field) => {
    if (errors[field]) {
      return (
        <Typography variant="small" color="red" className="mt-1">
          {errors[field]}
        </Typography>
      )
    }
    return null
  }

  const renderFormStep = () => {
    switch (formStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Typography variant="h6" color="blue-gray" className="mb-4">
              General Information
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  type="text"
                  label="Farmer Name"
                  value={formData.farmerName}
                  onChange={(e) => handleInputChange("farmerName", e.target.value)}
                  error={!!errors.farmerName}
                  icon={<MdPerson className="h-5 w-5" />}
                />
                {renderError("farmerName")}
              </div>
              <div>
                <Input
                  type="text"
                  label="Farm Location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  error={!!errors.location}
                  icon={<MdLocationOn className="h-5 w-5" />}
                />
                {renderError("location")}
              </div>
              <div>
                <Select
                  label="Crop Type"
                  value={formData.cropType || ""}
                  onChange={(value) => handleInputChange("cropType", value)}
                  error={!!errors.cropType}
                  selected={(element) =>
                    element &&
                    React.cloneElement(element, {
                      className: "font-medium text-blue-gray-900",
                    })
                  }
                >
                  {["Wheat", "Rice", "Maize", "Soybeans", "Cotton"].map((crop) => (
                    <Option key={crop} value={crop}>
                      {crop}
                    </Option>
                  ))}
                </Select>
                {renderError("cropType")}
              </div>
              <div>
                <Input
                  type="number"
                  label="Farm Size (Acres)"
                  value={formData.farmSize}
                  onChange={(e) => handleInputChange("farmSize", e.target.value)}
                  error={!!errors.farmSize}
                />
                {renderError("farmSize")}
              </div>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6">
            <Typography variant="h6" color="blue-gray" className="mb-4">
              Crop Health Analysis
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Growth Stage"
                value={formData.growthStage || ""}
                onChange={(value) => handleInputChange("growthStage", value)}
                selected={(element) =>
                  element &&
                  React.cloneElement(element, {
                    className: "font-medium text-blue-gray-900",
                  })
                }
              >
                {["Seedling", "Vegetative", "Flowering", "Harvesting"].map((stage) => (
                  <Option key={stage} value={stage}>
                    {stage}
                  </Option>
                ))}
              </Select>
              <Select
                label="Leaf Color"
                value={formData.leafColor || ""}
                onChange={(value) => handleInputChange("leafColor", value)}
                selected={(element) =>
                  element &&
                  React.cloneElement(element, {
                    className: "font-medium text-blue-gray-900",
                  })
                }
              >
                {["Green", "Yellowish", "Brown Spots", "Wilting"].map((color) => (
                  <Option key={color} value={color}>
                    {color}
                  </Option>
                ))}
              </Select>
              <Select
                label="Weather Conditions"
                value={formData.weather || ""}
                onChange={(value) => handleInputChange("weather", value)}
                selected={(element) =>
                  element &&
                  React.cloneElement(element, {
                    className: "font-medium text-blue-gray-900",
                  })
                }
              >
                {["Sunny", "Rainy", "Humid", "Dry"].map((weather) => (
                  <Option key={weather} value={weather}>
                    {weather}
                  </Option>
                ))}
              </Select>
              <Select
                label="Fertilizer Usage"
                value={formData.fertilizer || ""}
                onChange={(value) => handleInputChange("fertilizer", value)}
                selected={(element) =>
                  element &&
                  React.cloneElement(element, {
                    className: "font-medium text-blue-gray-900",
                  })
                }
              >
                {["Organic", "Chemical", "None"].map((type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6">
            <Typography variant="h6" color="blue-gray" className="mb-4">
              Pest Detection
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Select
                  label="Visible Pest Signs"
                  value={formData.pestSigns || ""}
                  onChange={(value) => handleInputChange("pestSigns", value)}
                  error={!!errors.pestSigns}
                  selected={(element) =>
                    element &&
                    React.cloneElement(element, {
                      className: "font-medium text-blue-gray-900",
                    })
                  }
                >
                  <Option key="yes" value="yes">
                    Yes
                  </Option>
                  <Option key="no" value="no">
                    No
                  </Option>
                </Select>
                {renderError("pestSigns")}
              </div>
              <div>
                <Select
                  label="Type of Damage"
                  value={formData.damageType || ""}
                  onChange={(value) => handleInputChange("damageType", value)}
                  error={!!errors.damageType}
                  selected={(element) =>
                    element &&
                    React.cloneElement(element, {
                      className: "font-medium text-blue-gray-900",
                    })
                  }
                >
                  {["Holes in Leaves", "Wilting", "Browning", "White Spots"].map((damage) => (
                    <Option key={damage} value={damage}>
                      {damage}
                    </Option>
                  ))}
                </Select>
                {renderError("damageType")}
              </div>
              <div>
                <Select
                  label="Pesticide Type"
                  value={formData.pesticide || ""}
                  onChange={(value) => handleInputChange("pesticide", value)}
                  error={!!errors.pesticide}
                  selected={(element) =>
                    element &&
                    React.cloneElement(element, {
                      className: "font-medium text-blue-gray-900",
                    })
                  }
                >
                  {["Organic", "Chemical", "None"].map((type) => (
                    <Option key={type} value={type}>
                      {type}
                    </Option>
                  ))}
                </Select>
                {renderError("pesticide")}
              </div>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-6">
            <Typography variant="h6" color="blue-gray" className="mb-4">
              Soil Analysis
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                variant="standard"
                label="Soil Type"
                value={formData.soilType || ""}
                onChange={(value) => handleInputChange("soilType", value)}
                error={!!errors.soilType}
                className="!text-white"
                labelProps={{
                  className: "!text-gray-400",
                }}
                color="green"
                containerProps={{
                  className: "!min-w-0",
                }}
                selected={(element) =>
                  element &&
                  React.cloneElement(element, {
                    className: "font-medium text-white",
                  })
                }
              >
                {["Sandy", "Clay", "Loamy", "Peaty", "Silty"].map((type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>

              <Select
                variant="standard"
                label="Soil Moisture Level"
                value={formData.moisture || ""}
                onChange={(value) => handleInputChange("moisture", value)}
                error={!!errors.moisture}
                className="!text-white"
                labelProps={{
                  className: "!text-gray-400",
                }}
                color="green"
                containerProps={{
                  className: "!min-w-0",
                }}
                selected={(element) =>
                  element &&
                  React.cloneElement(element, {
                    className: "font-medium text-white",
                  })
                }
              >
                <Option value="very-dry">Very Dry (0-20%)</Option>
                <Option value="dry">Dry (20-40%)</Option>
                <Option value="moderate">Moderate (40-60%)</Option>
                <Option value="moist">Moist (60-80%)</Option>
                <Option value="wet">Wet (80-100%)</Option>
              </Select>

              <Input
                variant="standard"
                label="pH Level"
                type="number"
                value={formData.phLevel || ""}
                onChange={(e) => handleInputChange("phLevel", e.target.value)}
                min="0"
                max="14"
                error={!!errors.phLevel}
                className="!text-white"
                labelProps={{
                  className: "!text-gray-400",
                }}
                color="green"
                containerProps={{
                  className: "!min-w-0",
                }}
              />

              <Select
                variant="standard"
                label="Fertilizer Type"
                value={formData.fertilizerType || ""}
                onChange={(value) => handleInputChange("fertilizerType", value)}
                error={!!errors.fertilizerType}
                className="!text-white"
                labelProps={{
                  className: "!text-gray-400",
                }}
                color="green"
                containerProps={{
                  className: "!min-w-0",
                }}
                selected={(element) =>
                  element &&
                  React.cloneElement(element, {
                    className: "font-medium text-white",
                  })
                }
              >
                {["Organic", "Chemical", "None"].map((type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Description Field */}
            {/* <div className="mt-8">
              <Textarea
                variant="standard"
                label="Additional Notes"
                value={formData.soilDescription || ""}
                onChange={(e) => handleInputChange("soilDescription", e.target.value)}
                rows={6}
                className="!text-white"
                labelProps={{
                  className: "!text-gray-400",
                }}
                color="green"
              />
            </div> */}

            {/* Summary Section */}
            {/* <div className="mt-8 p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
              <Typography variant="h6" className="text-white mb-4">
                Summary
              </Typography>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Typography variant="small" className="text-gray-400 font-medium">
                    Soil Type:
                  </Typography>
                  <Typography variant="small" className="text-white">
                    {formData.soilType || "Not selected"}
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" className="text-gray-400 font-medium">
                    Moisture Level:
                  </Typography>
                  <Typography variant="small" className="text-white">
                    {formData.moisture
                      ? {
                          "very-dry": "Very Dry (0-20%)",
                          dry: "Dry (20-40%)",
                          moderate: "Moderate (40-60%)",
                          moist: "Moist (60-80%)",
                          wet: "Wet (80-100%)",
                        }[formData.moisture]
                      : "Not selected"}
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" className="text-gray-400 font-medium">
                    pH Level:
                  </Typography>
                  <Typography variant="small" className="text-white">
                    {formData.phLevel || "Not provided"}
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" className="text-gray-400 font-medium">
                    Fertilizer Type:
                  </Typography>
                  <Typography variant="small" className="text-white">
                    {formData.fertilizerType || "Not selected"}
                  </Typography>
                </div>
              </div>
            </div> */}

            {/* Error Messages */}
            {Object.keys(errors).length > 0 && (
              <div className="mt-4 p-4 bg-red-900/20 border border-red-700 rounded-xl">
                <Typography variant="small" className="text-red-400 font-medium">
                  Please fix the following errors:
                </Typography>
                <ul className="list-disc list-inside mt-2">
                  {Object.values(errors).map((error, index) => (
                    <li key={index} className="text-red-400 text-sm">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {/* <div className="relative bg-[#1B4332] py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] opacity-90" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-white">
              <div className="inline-block px-4 py-2 bg-green-800/30 rounded-full mb-6">
                <Typography className="text-green-300">AI-Powered Agriculture</Typography>
              </div>
              <Typography variant="h1" className="text-5xl md:text-6xl font-bold mb-6">
                Transform Your Farm with Smart AI Solutions
              </Typography>j
              <Typography variant="lead" className="text-xl mb-8 text-gray-200">
                Harness the power of artificial intelligence to optimize yields, prevent diseases, and make data-driven
                farming decisions.
              </Typography>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-[#40916C] hover:bg-[#52B788] transition-all">
                  Get Started
                </Button>
                <Button size="lg" variant="outlined" className="text-white border-white hover:bg-white/10">
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <div className="absolute -inset-4 bg-[#40916C]/20 rounded-lg blur-xl"></div>
                <img src="/path-to-hero-image.jpg" alt="AI Agriculture" className="relative rounded-lg shadow-xl" />
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Form Section */}
      <div className="py-16 bg-[#F8F9FA]">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto">
            <CardBody className="p-8">
              <div className="mb-8">
                <Typography variant="h4" color="blue-gray" className="mb-2">
                  Farm Analysis Form
                </Typography>
                <Typography color="gray">
                  Please provide details about your farm for a comprehensive analysis
                </Typography>
              </div>

              {/* Progress Steps */}
              <div className="flex justify-between mb-8">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className={`flex items-center ${step !== 4 ? "flex-1" : ""}`}>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step <= formStep ? "bg-[#40916C] text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {step}
                    </div>
                    {step !== 4 && (
                      <div className={`flex-1 h-1 mx-2 ${step < formStep ? "bg-[#40916C]" : "bg-gray-200"}`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="space-y-8">
                {renderFormStep()}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <Button
                    variant="text"
                    onClick={() => setFormStep(Math.max(1, formStep - 1))}
                    disabled={formStep === 1}
                    type="button"
                  >
                    Previous
                  </Button>
                  <Button
                    className="bg-[#40916C]"
                    onClick={formStep === 4 ? handleSubmit : handleNext}
                    type={formStep === 4 ? "submit" : "button"}
                  >
                    {formStep === 4 ? "Submit" : "Next"}
                  </Button>
                </div>
              </form>
              {analysisResult && (
                <div className="mt-8 p-4 bg-green-100 rounded-xl border border-green-200">
                  <Typography variant="h6" className="text-green-800 mb-4">
                    Gemini Analysis Results
                  </Typography>
                  <div className="space-y-4">
                    <Typography className="text-green-700">
                      <strong>Field Health Condition:</strong> {analysisResult.healthCondition}
                    </Typography>

                    {/* Health Bar Chart */}
                    <div className="mt-4">
                      <Typography variant="h6" className="text-green-800 mb-2">
                        Crop Health Analysis
                      </Typography>
                      <HealthBarChart data={graphData.healthData} />
                    </div>

                    {/* Pest Pie Chart */}
                    <div className="mt-4">
                      <Typography variant="h6" className="text-green-800 mb-2">
                        Pest Risk Analysis
                      </Typography>
                      <PestPieChart data={graphData.pestData} />
                    </div>

                    {/* Recommendations */}
                    <Typography className="text-green-700">
                      <strong>Recommended Improvements:</strong>
                    </Typography>
                    <ul className="list-disc list-inside pl-4">
                      {analysisResult.recommendations.map((rec, index) => (
                        <li key={index} className="text-green-700">
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Enhanced Stats Section */}
      <div className="py-16 bg-[#F8F9FA]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                value: "40%",
                label: "Average Yield Increase",
                icon: <MdTrendingUp />,
                color: "green",
              },
              { value: "24/7", label: "Real-time Monitoring", icon: <MdCloud /> },
              { value: "85%", label: "Early Detection Rate", icon: <MdSecurity /> },
              { value: "10k+", label: "Active Farmers", icon: <MdPerson /> },
            ].map((stat, index) => (
              <Card key={index} className="stat-card group hover:shadow-2xl transition-all duration-500">
                <CardBody className="p-6">
                  <div className="relative overflow-hidden rounded-xl p-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#40916C]/10 to-transparent group-hover:scale-110 transition-transform duration-500" />
                    <div className="relative z-10">
                      <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-[#40916C]/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                          <div className="text-[#2D6A4F] text-3xl">{stat.icon}</div>
                        </div>
                      </div>
                      <Typography
                        variant="h3"
                        color="blue-gray"
                        className="mb-2 text-center group-hover:text-[#2D6A4F] transition-colors duration-300"
                      >
                        {stat.value}
                      </Typography>
                      <Typography
                        color="gray"
                        className="text-center group-hover:text-[#40916C] transition-colors duration-300"
                      >
                        {stat.label}
                      </Typography>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Feature Cards Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-[#40916C]/10 rounded-full mb-4">
              <Typography className="text-[#2D6A4F]">Our Solutions</Typography>
            </div>
            <Typography variant="h2" className="text-4xl font-bold mb-4 text-[#1B4332]">
              AI-Powered Agricultural Tools
            </Typography>
            <Typography variant="lead" color="gray" className="max-w-2xl mx-auto">
              Comprehensive suite of intelligent tools designed to revolutionize your farming practices
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: <MdOutlineHealthAndSafety />,
                title: "Crop Health Analysis",
                description: "Advanced AI algorithms for early disease detection and nutrient management",
                features: ["Real-time health monitoring", "Disease prediction", "Growth stage tracking"],
                gradient: "from-green-500/20 to-emerald-500/20",
              },
              {
                icon: <MdBugReport />,
                title: "Pest Detection",
                description: "Smart pest monitoring system with early warning alerts",
                features: ["Automated pest identification", "Risk assessment", "Treatment recommendations"],
              },
              {
                icon: <MdScience />,
                title: "Soil Analysis",
                description: "Comprehensive soil health monitoring and recommendations",
                features: ["Nutrient level tracking", "pH monitoring", "Moisture analysis"],
              },
            ].map((feature, index) => (
              <Card key={index} className="feature-card group hover:shadow-2xl transition-all duration-500">
                <CardBody className="p-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                    <div className="relative z-10">
                      <div className="icon-wrapper w-20 h-20 bg-[#40916C]/10 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:shadow-lg">
                        <div className="text-[#2D6A4F] text-4xl group-hover:scale-110 transition-transform duration-500">
                          {feature.icon}
                        </div>
                      </div>
                      <Typography
                        variant="h5"
                        className="feature-title text-[#1B4332] mb-4 group-hover:translate-x-2 transition-transform duration-300"
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        color="gray"
                        className="mb-6 group-hover:text-[#2D6A4F] transition-colors duration-300"
                      >
                        {feature.description}
                      </Typography>
                      <ul className="space-y-3">
                        {feature.features.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-3 group-hover:translate-x-2 transition-transform duration-300"
                          >
                            <div className="w-6 h-6 rounded-full bg-[#40916C]/20 flex items-center justify-center">
                              <MdCheck className="text-[#2D6A4F]" />
                            </div>
                            <Typography className="text-gray-600 group-hover:text-[#1B4332]">{item}</Typography>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* How It Works Section */}
          <div className="py-16">
            <div className="text-center mb-12">
              <Typography variant="h3" className="text-[#1B4332] mb-4">
                How It Works
              </Typography>
              <Typography color="gray" className="max-w-2xl mx-auto">
                Simple steps to transform your farming with AI
              </Typography>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Connect Sensors",
                  description: "Install our smart sensors in your fields",
                },
                {
                  step: "02",
                  title: "Collect Data",
                  description: "Automated data collection begins immediately",
                },
                {
                  step: "03",
                  title: "AI Analysis",
                  description: "Our AI processes and analyzes your farm data",
                },
                {
                  step: "04",
                  title: "Get Insights",
                  description: "Receive actionable insights and recommendations",
                },
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-[#40916C] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    {step.step}
                  </div>
                  <Typography variant="h6" className="text-[#1B4332] mb-2">
                    {step.title}
                  </Typography>
                  <Typography color="gray">{step.description}</Typography>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 bg-[#1B4332] rounded-2xl p-12 text-center">
            <Typography variant="h3" className="text-white mb-4">
              Ready to Transform Your Farm?
            </Typography>
            <Typography className="text-gray-200 mb-8 max-w-2xl mx-auto">
              Join thousands of farmers already using our AI-powered solutions to improve yields and reduce costs.
            </Typography>
            <Button size="lg" className="bg-white text-[#1B4332] hover:bg-gray-100 transition-all">
              Get Started Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Features

