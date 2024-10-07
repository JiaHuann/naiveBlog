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
          <HomePageLeft/>
        </Col>
        <Col xs={24} sm={12} md={12}>
          <MySpacer/>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div className="flex justify-center mt-5"><MyCalender /></div>
          <div className="flex justify-center mt-10"><TechStack /></div>
        </Col>
      </Row>
    </div>
  );
}