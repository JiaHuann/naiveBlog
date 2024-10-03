import {Card, CardHeader, CardBody, Image} from "@nextui-org/react";

export default function App() {
  return (
    <Card className="py-4">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <span className="text-xl font-bold font-mono">Daily Mix</span>
        <small className="text-default-500">12 Tracks</small>
        <h4 className="text-large">Frontend Radio</h4>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <Image
          alt="Card background"
          className="object-cover rounded-xl"
          src="https://nextui.org/images/hero-card-complete.jpeg"
          width={270}
        />
      </CardBody>
    </Card>
  );
}