import {Card, CardHeader, CardBody, Image} from "@nextui-org/react";
import Link from "next/link";

export default function App() {
  return (
    <Card className="py-4">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <span className="text-xl font-bold font-mono">
          <Link target='_blank' href="/浅析KPROBE_OVEERRIDE在错误注入中的使用.html">
          浅析KPROBE_OVEERRIDE在错误注入中的使用
          </Link>
        </span>
        <small className="text-default-500">Liujiahuan with ByteDance.</small>
        <h4 className="text-large">#内核 #eBPF</h4>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <Image
          alt="Card background"
          className="object-cover rounded-xl"
          src="https://www.loliapi.com/acg/"
          width={370}
        />
      </CardBody>
    </Card>
  );
}