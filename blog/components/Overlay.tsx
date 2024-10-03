'use client'
import { useState, useEffect } from 'react';
import { Button } from "@nextui-org/react";
import styles from './MyOverlay.module.css';

import { Typography } from 'antd';

const { Title } = Typography;

export default function MyOverlay() {
  const [isVisible, setIsVisible] = useState(true);   // 控制遮罩是否可见
  const [isAnimating, setIsAnimating] = useState(false); // 控制是否触发动画

  // 页面加载时遮罩慢慢滑下来
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsAnimating(true);  // 开始触发动画，滑下来
    }, 100);  // 页面加载后100ms开始动画

    return () => clearTimeout(timeoutId);
  }, []);

  // 当用户点击或滚动时，遮罩滑上去隐藏
  useEffect(() => {
    const handleScroll = () => {
      setIsAnimating(false);  // 开始上滑动画
      setTimeout(() => {
        setIsVisible(false);  // 隐藏遮罩
      }, 800);  // 上滑动画结束后隐藏
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClick = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
    }, 800); // 点击后上滑动画，800ms后隐藏遮罩
  };

  return (
    <>
      {isVisible && (
        <div className={`${styles.overlay} ${isAnimating ? styles.show : styles.hide}`} onClick={handleClick}>
          <div className={styles.sloganContainer}>
            <Title level={1} className="font-mono text-white backdrop-blur-sm bg-opacity-10 p-6 rounded-lg">Welcome to Liu Jiahuan's Blog</Title>
            <Title level={2} className="font-mono text-white backdrop-blur-sm bg-opacity-10 p-6 rounded-lg">I Really Want to Stay At Your House.....</Title>
            <Button onClick={handleClick} radius="sm" className="mt-30 bg-gradient-to-tr from-pink-500 to-blue-500 text-white shadow-lg font-mono">
                Explore.
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
