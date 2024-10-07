import {Card, Progress} from "@nextui-org/react";

export default function TechStack() {
  return (
    <Card className="flex flex-col gap-3 w-full max-w-md bg-white m-5 p-2">

      <Progress className="font-mono" color="default" label="Linux Using" value={90} showValueLabel={true} />
      <Progress className="font-mono" color="primary" label="Backend Dev" value={40}  showValueLabel={true}/>
      <Progress className="font-mono" color="secondary" label="Frontend Dev" value={60}  showValueLabel={true}/>
      <Progress className="font-mono" color="danger" label="Linux Kernel Research" value={80}  showValueLabel={true}/>
      <Progress className="font-mono" color="danger" label="CI/CD" value={50}  showValueLabel={true}/>
    </Card>

  );
}

