import MyCalender from "@/components/Calender";
import MySpacer from "@/components/spacer";
import TechStack from "@/info/TechStack";
import { Col, Row } from "antd";
export default function Home() {
  return (
    <div>
      <Row>
        <Col span={6}>
          <p className="w-full bg-yellow-500">left space</p>
        </Col>
        <Col span={12}>
          <p className="w-full bg-blue-500">col-12 col-offset-6</p>
          <MySpacer/>
        </Col>
        <Col span={6}>
          <p className="w-full bg-green-500">right space</p>
          <div className="flex justify-center"><MyCalender /></div>
          <div className="flex justify-center"><TechStack /></div>
        </Col>
      </Row>

    </div>
  );
}
