import MyCalender from "@/components/Calender";
import MySpacer from "@/components/spacer";
import TechStack from "@/components/info/TechStack";
import { Col, Row } from "antd";
import MyOverlay from "@/components/Overlay"; // 引入遮罩组件

export default function Home() {
  return (
    <div>
      <MyOverlay />  {/* 添加遮罩组件 */}

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
          <div className="flex justify-center mt-10"><MyCalender /></div>
          <div className="flex justify-center mt-10"><TechStack /></div>
        </Col>
      </Row>
    </div>
  );
}
