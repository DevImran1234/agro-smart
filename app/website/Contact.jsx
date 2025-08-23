// import { Button, Input, Textarea, Typography } from "@material-tailwind/react";

// export function Contact() {
//   return (
//     <div className="container mx-auto px-4 py-12">
//       <Typography variant="h2" className="mb-8 text-center">Contact Us</Typography>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
//         <div>
//           <Typography variant="h5" className="mb-4">Get in Touch</Typography>
//           <Typography className="mb-8">
//             Have questions about AgriMed Hub? We're here to help! Fill out the form
//             and we'll get back to you as soon as possible.
//           </Typography>
          
//           <div className="space-y-4">
//             <div>
//               <Typography variant="h6" className="mb-2">Email</Typography>
//               <Typography>contact@agrimedhub.com</Typography>
//             </div>
//             <div>
//               <Typography variant="h6" className="mb-2">Phone</Typography>
//               <Typography>+1 (234) 567-8900</Typography>
//             </div>
//           </div>
//         </div>

//         <form className="space-y-6">
//           <Input label="Name" size="lg" />
//           <Input label="Email" size="lg" type="email" />
//           <Input label="Subject" size="lg" />
//           <Textarea label="Message" size="lg" />
//           <Button color="green" className="w-full">
//             Send Message
//           </Button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Contact;






import { useState, useEffect } from "react";
import { Button, Input, Textarea, Typography, Select, Option } from "@material-tailwind/react";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { IndexedDBService } from "../../services/indexedDBService";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaWhatsapp, FaInfoCircle } from 'react-icons/fa';

// Fix for default marker icon in react-leaflet
const defaultIcon = new Icon({
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const QUERY_CATEGORIES = [
  "Soil Health",
  "Crop Disease",
  "Irrigation",
  "Weather Impact",
  "Pesticide Issues",
  "Fertilizer Recommendation",
  "General Inquiry"
];

const URGENCY_LEVELS = [
  { value: "low", label: "Low Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "high", label: "High Priority" }
];

const CONTACT_METHODS = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "whatsapp", label: "WhatsApp" }
];

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} icon={defaultIcon} /> : null;
}

export function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    farmName: '',
    region: '',
    category: '',
    urgencyLevel: '',
    preferredContact: '',
    attachments: []
  });
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value, name) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));

    // Generate previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition([position.coords.latitude, position.coords.longitude]);
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!position) {
      alert("Please select a location on the map");
      return;
    }

    try {
      const queryData = {
        ...formData,
        latitude: position[0],
        longitude: position[1],
      };
      
      await IndexedDBService.addContactQuery(queryData);
      alert("Query submitted successfully!");
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        farmName: '',
        region: '',
        category: '',
        urgencyLevel: '',
        preferredContact: '',
        attachments: []
      });
      setPosition(null);
      setPreviewImages([]);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to send query. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-12 pt-24">
        {/* Enhanced Header Section */}
        <div className="text-center mb-12">
          <Typography variant="h1" className="text-5xl font-bold text-white mb-4">
            Get in Touch
          </Typography>
          <Typography className="text-xl text-gray-400 max-w-3xl mx-auto">
            Connect with AgriMed Hub's agricultural experts for personalized guidance and support. 
            Our GIS-enabled system ensures precise, location-specific solutions for your farming needs.
          </Typography>
        </div>

        {/* GIS Information Section */}
        <div className="max-w-7xl mx-auto mb-12 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Typography variant="h4" className="text-white mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-green-400" />
                GIS Tagging for Smart Farming
              </Typography>
              <Typography className="text-gray-400 mb-6">
                By sharing your farm's location, you enable our system to provide precise, 
                location-specific agricultural solutions. Our GIS technology helps track and 
                analyze various factors affecting your farm's productivity.
              </Typography>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-900/50 p-2 rounded-lg mt-1">
                    <FaMapMarkerAlt className="text-green-400" />
                  </div>
                  <div>
                    <Typography variant="h6" className="text-white">
                      Improved Field Monitoring
                    </Typography>
                    <Typography className="text-gray-400">
                      Track soil health, weather patterns, and crop conditions specific to your location.
                    </Typography>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-900/50 p-2 rounded-lg mt-1">
                    <FaMapMarkerAlt className="text-green-400" />
                  </div>
                  <div>
                    <Typography variant="h6" className="text-white">
                      Tailored Recommendations
                    </Typography>
                    <Typography className="text-gray-400">
                      Receive customized advice for irrigation, pest control, and crop management.
                    </Typography>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-900/50 p-2 rounded-lg mt-1">
                    <FaMapMarkerAlt className="text-green-400" />
                  </div>
                  <div>
                    <Typography variant="h6" className="text-white">
                      Local Challenge Alerts
                    </Typography>
                    <Typography className="text-gray-400">
                      Stay informed about regional pest outbreaks, diseases, and weather conditions.
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
              <Typography variant="h5" className="text-white mb-4">
                How to Share Your Location
              </Typography>
              
              <div className="space-y-6">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <Typography variant="h6" className="text-green-400 mb-2">
                    Option 1: Auto-Detect Location
                  </Typography>
                  <Typography className="text-gray-400">
                    Use your device's GPS for accurate location detection. Click the 
                    "Get Current Location" button below the map.
                  </Typography>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4">
                  <Typography variant="h6" className="text-green-400 mb-2">
                    Option 2: Manual Selection
                  </Typography>
                  <Typography className="text-gray-400">
                    Click directly on the map to pinpoint your farm's exact location.
                  </Typography>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4">
                  <Typography variant="h6" className="text-white mb-2 flex items-center gap-2">
                    <FaInfoCircle className="text-green-400" />
                    Data Privacy
                  </Typography>
                  <Typography className="text-gray-400">
                    Your location data is securely stored and used solely for providing 
                    better agricultural services and recommendations.
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Existing Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-8xl mx-auto">
          {/* Left Column - Contact Info & Map */}
          <div className="lg:col-span-4 space-y-6">
            {/* Contact Information Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-700">
              <Typography variant="h5" className="text-white font-bold mb-6 flex items-center gap-2">
                <FaInfoCircle className="text-green-400" />
                Contact Information
              </Typography>
              
              <div className="space-y-8">
                <div className="flex items-center space-x-4 group">
                  <div className="bg-green-900/50 p-4 rounded-xl group-hover:bg-green-800/50 transition-colors duration-300">
                    <FaPhone className="text-green-400 text-xl" />
                  </div>
                  <div>
                    <Typography className="font-medium text-white">Phone</Typography>
                    <Typography className="text-gray-400 hover:text-green-400 transition-colors duration-300">
                      +1 (234) 567-8900
                    </Typography>
                  </div>
                </div>

                <div className="flex items-center space-x-4 group">
                  <div className="bg-green-900/50 p-4 rounded-xl group-hover:bg-green-800/50 transition-colors duration-300">
                    <FaEnvelope className="text-green-400 text-xl" />
                  </div>
                  <div>
                    <Typography className="font-medium text-white">Email</Typography>
                    <Typography className="text-gray-400 hover:text-green-400 transition-colors duration-300">
                      contact@agrimedhub.com
                    </Typography>
                  </div>
                </div>

                <div className="flex items-center space-x-4 group">
                  <div className="bg-green-900/50 p-4 rounded-xl group-hover:bg-green-800/50 transition-colors duration-300">
                    <FaWhatsapp className="text-green-400 text-xl" />
                  </div>
                  <div>
                    <Typography className="font-medium text-white">WhatsApp</Typography>
                    <Typography className="text-gray-400 hover:text-green-400 transition-colors duration-300">
                      +1 (234) 567-8900
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-700">
              <Typography variant="h5" className="text-white font-bold mb-6 flex items-center gap-2">
                <FaMapMarkerAlt className="text-green-400" />
                Location Selector
              </Typography>
              
              <div className="h-[330px] rounded-xl overflow-hidden mb-4 border border-gray-700">
                <MapContainer
                  center={position || [0, 0]}
                  zoom={position ? 13 : 2}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <LocationMarker position={position} setPosition={setPosition} />
                </MapContainer>
              </div>
              
              <Button 
                color="green"
                className="w-full bg-green-700 hover:bg-green-600 transition-colors duration-300 flex items-center justify-center gap-2"
                onClick={getCurrentLocation}
                disabled={loading}
              >
                <FaMapMarkerAlt />
                {loading ? "Getting Location..." : "Get Current Location"}
              </Button>

              {position && (
                <div className="mt-4 p-4 bg-gray-700/50 rounded-lg">
                  <Typography className="text-sm text-gray-300 flex items-center gap-2">
                    <FaInfoCircle className="text-green-400" />
                    Selected Coordinates:
                  </Typography>
                  <Typography className="text-green-400 font-mono mt-1">
                    {position[0].toFixed(6)}, {position[1].toFixed(6)}
                  </Typography>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Query Form */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-700">
              <Typography variant="h5" className="text-white font-bold mb-8">
                Submit Your Query
              </Typography>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  variant="standard"
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="!text-white"
                  labelProps={{
                    className: "!text-gray-400"
                  }}
                  color="green"
                  containerProps={{
                    className: "!min-w-0"
                  }}
                />
                
                <Input
                  variant="standard"
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="!text-white"
                  labelProps={{
                    className: "!text-gray-400"
                  }}
                  color="green"
                  containerProps={{
                    className: "!min-w-0"
                  }}
                />

                <Input
                  variant="standard"
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="!text-white"
                  labelProps={{
                    className: "!text-gray-400"
                  }}
                  color="green"
                  containerProps={{
                    className: "!min-w-0"
                  }}
                />

                <Input
                  variant="standard"
                  label="Farm/Field Name"
                  name="farmName"
                  value={formData.farmName}
                  onChange={handleInputChange}
                  className="!text-white"
                  labelProps={{
                    className: "!text-gray-400"
                  }}
                  color="green"
                  containerProps={{
                    className: "!min-w-0"
                  }}
                />

                <Input
                  variant="standard"
                  label="Region/City"
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  required
                  className="!text-white"
                  labelProps={{
                    className: "!text-gray-400"
                  }}
                  color="green"
                  containerProps={{
                    className: "!min-w-0"
                  }}
                />

                <Select
                  variant="standard"
                  label="Query Category"
                  value={formData.category}
                  onChange={(value) => handleSelectChange(value, 'category')}
                  required
                  className="!text-white"
                  labelProps={{
                    className: "!text-gray-400"
                  }}
                  color="green"
                  containerProps={{
                    className: "!min-w-0"
                  }}
                >
                  {QUERY_CATEGORIES.map((category) => (
                    <Option key={category} value={category}>
                      {category}
                    </Option>
                  ))}
                </Select>

                <Select
                  variant="standard"
                  label="Urgency Level"
                  value={formData.urgencyLevel}
                  onChange={(value) => handleSelectChange(value, 'urgencyLevel')}
                  required
                  className="!text-white"
                  labelProps={{
                    className: "!text-gray-400"
                  }}
                  color="green"
                  containerProps={{
                    className: "!min-w-0"
                  }}
                >
                  {URGENCY_LEVELS.map((level) => (
                    <Option key={level.value} value={level.value}>
                      {level.label}
                    </Option>
                  ))}
                </Select>

                <Select
                  variant="standard"
                  label="Preferred Contact Method"
                  value={formData.preferredContact}
                  onChange={(value) => handleSelectChange(value, 'preferredContact')}
                  required
                  className="!text-white"
                  labelProps={{
                    className: "!text-gray-400"
                  }}
                  color="green"
                  containerProps={{
                    className: "!min-w-0"
                  }}
                >
                  {CONTACT_METHODS.map((method) => (
                    <Option key={method.value} value={method.value}>
                      {method.label}
                    </Option>
                  ))}
                </Select>
              </div>

              <div className="mt-8">
                <Textarea
                  variant="standard"
                  label="Message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="!text-white"
                  labelProps={{
                    className: "!text-gray-400"
                  }}
                  color="green"
                />
              </div>

              {/* File Upload Section */}
              <div className="mt-8">
                <Typography variant="h6" className="text-white mb-4">
                  Attachments
                </Typography>
                <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-green-400 transition-colors duration-300">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="text-gray-400 hover:text-green-400 transition-colors duration-300">
                      <FaInfoCircle className="text-3xl mx-auto mb-2" />
                      <Typography>
                        Drop files here or click to upload
                      </Typography>
                      <Typography className="text-sm text-gray-500 mt-1">
                        (Images only)
                      </Typography>
                    </div>
                  </label>
                </div>
                
                {/* Image Previews */}
                {previewImages.length > 0 && (
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    {previewImages.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-700"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                          <Button
                            color="red"
                            size="sm"
                            className="!absolute !top-2 !right-2"
                            onClick={() => {/* Add remove function */}}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full mt-8 bg-green-700 hover:bg-green-600 transition-colors duration-300"
                size="lg"
              >
                Submit Query
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;