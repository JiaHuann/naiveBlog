import {Card, CardHeader, CardBody, Image} from "@nextui-org/react";
import Link from "next/link";

export default function BlogCardShown({href,title,subContent,tags,imageUrl}:any) {
  return (
    <Card className="py-4 bg-opacity-80">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <span className="text-xl font-bold font-mono">
          <Link target='_blank' href={href} >
          {title}
          </Link>
        </span>
        <small className="text-default-800">{subContent}</small>
        <small className="text-default-500">{tags}</small>
      </CardHeader>
      
      <CardBody className="overflow-visible py-2">
        <Image
          alt="Card background"
          className="object-cover rounded-xl"
          src={imageUrl}
          width={370}
        />
      </CardBody>
    </Card>
  );
}