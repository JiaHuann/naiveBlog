'use client'
import { Col, Row } from "antd";
import MyPdfViewer from "./PDF";
import MyPDF from "./PDF";

export default function AboutMePage(){
    return (
        <div>
            <Row>
                <Col span={4}>
                    {/* 左侧 */}
                    <p className="w-full bg-yellow-500">left space</p>
                </Col>
                <Col span={16}>
                    {/* 主体内容 */}
                    <p className="w-full bg-blue-500">col-12 col-offset-6</p>
                    <MyPDF></MyPDF>
                </Col>
                <Col span={4}>
                    {/* 右侧小组件部分 */}
                    <p className="w-full bg-green-500">right space</p>
                </Col>
            </Row>
        </div>
    )
}