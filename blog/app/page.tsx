import MyCalender from "@/components/Calender";
import MySpacer from "@/components/spacer";
import TechStack from "@/components/info/TechStack";
import { Col, Row } from "antd";
import MyOverlay from "@/components/Overlay"; // 引入遮罩组件
import HomePageLeft from "@/components/HomePageLeft";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <MyOverlay />  {/* 添加遮罩组件 */}
      
      <Row className="flex flex-wrap">
        <Col xs={24} sm={12} md={6}>
          <p className="w-full bg-yellow-500">left space</p>
          <HomePageLeft/>
        </Col>
        <Col xs={24} sm={12} md={12}>
          <p className="w-full bg-blue-500">col-12 col-offset-6</p>
          <MySpacer/>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <p className="w-full bg-green-500">right space</p>
          <div className="flex justify-center mt-10"><MyCalender /></div>
          <div className="flex justify-center mt-10"><TechStack /></div>
        </Col>
      </Row>
    </div>
  );
}