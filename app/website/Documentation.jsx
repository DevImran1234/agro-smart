import { Typography } from "@material-tailwind/react";

export function Documentation() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Typography variant="h2" className="mb-8">Documentation</Typography>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="sticky top-24">
            <Typography variant="h6" className="mb-4">Contents</Typography>
            <ul className="space-y-2">
              {docSections.map((section, index) => (
                <li key={index}>
                  <a href={`#${section.id}`} className="text-blue-500 hover:text-blue-700">
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:col-span-2">
          {docSections.map((section, index) => (
            <div key={index} id={section.id} className="mb-12">
              <Typography variant="h4" className="mb-4">{section.title}</Typography>
              <Typography>{section.content}</Typography>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const docSections = [
  {
    id: "getting-started",
    title: "Getting Started",
    content: "Learn how to set up and start using SmartAgro Hub for your agricultural needs."
  },
  {
    id: "data-management",
    title: "Data Management",
    content: "Understand how to effectively manage your agricultural data using our secure, offline-first system."
  },
  {
    id: "health-monitoring",
    title: "Health Monitoring",
    content: "Guide to using the health monitoring features for agricultural workers."
  },
  {
    id: "ai-features",
    title: "AI Features",
    content: "Detailed documentation on using AI-powered crop analysis and pest detection."
  }
];

export default Documentation;