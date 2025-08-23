import { Typography, Card, CardBody } from "@material-tailwind/react";

export function Solutions() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Typography variant="h2" className="mb-8">Agricultural Solutions</Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {solutions.map((solution, index) => (
          <Card key={index}>
            <CardBody>
              <Typography variant="h5" className="mb-4">{solution.title}</Typography>
              <Typography>{solution.description}</Typography>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

const solutions = [
  {
    title: "Smart Farming",
    description: "AI-driven crop management and precision agriculture solutions."
  },
  {
    title: "Health Monitoring",
    description: "Comprehensive health tracking system for agricultural workers."
  },
  {
    title: "Data Management",
    description: "Secure, offline-first storage for agricultural records."
  },
  {
    title: "Education Platform",
    description: "Interactive learning resources for sustainable farming practices."
  }
];

export default Solutions;